// src/pages/missions/MissionsPage.tsx
import React, { useEffect, useState } from 'react';
import { Mission } from '@/entities/mission/model/types';
import { fetchMissions } from '@/entities/mission/model/missionApi';
import { MissionCard } from '@/entities/mission/ui/MissionCard';

export const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMissions();
        setMissions(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-4">Loading missions…</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Missions</h2>
      {missions.map(m => (
        <MissionCard key={m.id} mission={m} />
      ))}
    </div>
  );
};

// Export for routing (if using a router)
export default MissionsPage;
