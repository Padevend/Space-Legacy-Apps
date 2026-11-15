"""
Database connection and bulk execution layer for data-integration.

Handles PostgreSQL connection management, table verification, transaction
control, and high-performance bulk insertion using psycopg2.extras.execute_values.
"""

import logging
from typing import Any

try:
    import psycopg2
    from psycopg2 import sql
    from psycopg2.extras import execute_values
    PSYCOPG2_AVAILABLE = True
except ImportError:
    psycopg2 = None
    sql = None
    execute_values = None
    PSYCOPG2_AVAILABLE = False

from config import get_connection_params, ON_CONFLICT_ACTION

log = logging.getLogger("data-integration.db")


class DatabaseManager:
    """Manages PostgreSQL connection and bulk SQL execution."""

    def __init__(self, connection_params: dict | None = None):
        self.params = connection_params or get_connection_params()
        self.conn = None

    def connect(self):
        """Establish connection to PostgreSQL."""
        if not PSYCOPG2_AVAILABLE:
            raise RuntimeError("psycopg2 is not installed. To connect to PostgreSQL, please install psycopg2 or use .venv.")
        if self.conn and not self.conn.closed:
            return self.conn
        try:
            self.conn = psycopg2.connect(**self.params)
            return self.conn
        except psycopg2.OperationalError as exc:
            log.error("Failed to connect to PostgreSQL: %s", exc)
            raise

    def close(self):
        """Close connection if open."""
        if self.conn and not self.conn.closed:
            self.conn.close()
            self.conn = None

    def test_connection(self) -> tuple[bool, str]:
        """Test PostgreSQL connection and return (success, message)."""
        try:
            conn = self.connect()
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                version = cur.fetchone()[0]
            return True, f"Connected to PostgreSQL: {version}"
        except Exception as exc:
            return False, f"Connection failed: {exc}"

    def get_existing_tables(self) -> set[str]:
        """Return the set of table names existing in the public schema."""
        conn = self.connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
                """
            )
            rows = cur.fetchall()
            return {r[0] for r in rows}

    def execute_bulk_insert(
        self,
        table_name: str,
        columns: list[str],
        rows: list[list[Any]],
        pk_columns: list[str],
        batch_size: int = 500,
        on_conflict: str = ON_CONFLICT_ACTION,
    ) -> int:
        """
        Execute targeted bulk insert into a table with conflict resolution.

        Parameters
        ----------
        table_name:
            Target database table name (e.g. 'missions').
        columns:
            List of column names matching the row elements.
        rows:
            List of row value lists to insert.
        pk_columns:
            List of primary key column names for the ON CONFLICT target.
        batch_size:
            Number of rows per bulk batch.
        on_conflict:
            'DO NOTHING' or 'DO UPDATE'.

        Returns
        -------
        int
            Number of rows affected / inserted.
        """
        if not rows or not columns:
            return 0

        conn = self.connect()

        # Build column identifiers safely with double-quotes
        cols_ident = [sql.Identifier(col) for col in columns]
        table_ident = sql.Identifier(table_name)

        # Conflict clause
        if pk_columns:
            pk_ident = [sql.Identifier(pk) for pk in pk_columns]
            if on_conflict == "DO UPDATE":
                # Update non-PK columns
                update_cols = [c for c in columns if c not in pk_columns]
                if update_cols:
                    update_set = [
                        sql.SQL("{col} = EXCLUDED.{col}").format(col=sql.Identifier(c))
                        for c in update_cols
                    ]
                    conflict_clause = sql.SQL(
                        "ON CONFLICT ({pks}) DO UPDATE SET {updates}"
                    ).format(
                        pks=sql.SQL(", ").join(pk_ident),
                        updates=sql.SQL(", ").join(update_set),
                    )
                else:
                    conflict_clause = sql.SQL("ON CONFLICT ({pks}) DO NOTHING").format(
                        pks=sql.SQL(", ").join(pk_ident)
                    )
            else:
                conflict_clause = sql.SQL("ON CONFLICT ({pks}) DO NOTHING").format(
                    pks=sql.SQL(", ").join(pk_ident)
                )
        else:
            conflict_clause = sql.SQL("")

        # Construct final query template
        query = sql.SQL(
            "INSERT INTO {table} ({cols}) VALUES %s {conflict};"
        ).format(
            table=table_ident,
            cols=sql.SQL(", ").join(cols_ident),
            conflict=conflict_clause,
        )

        total_inserted = 0
        with conn.cursor() as cur:
            # Execute in batches
            execute_values(
                cur,
                query,
                rows,
                page_size=batch_size,
            )
            total_inserted = cur.rowcount
            conn.commit()

        return total_inserted

    def truncate_tables(self, tables_in_reverse_order: list[str]) -> None:
        """Truncate all specified tables with CASCADE in reverse dependency order."""
        conn = self.connect()
        with conn.cursor() as cur:
            for tbl in tables_in_reverse_order:
                cur.execute(
                    sql.SQL("TRUNCATE TABLE {tbl} CASCADE;").format(
                        tbl=sql.Identifier(tbl)
                    )
                )
            conn.commit()
