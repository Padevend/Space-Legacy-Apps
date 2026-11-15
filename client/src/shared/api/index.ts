import type {
  Equipment,
  EquipmentType,
  OperationalStatus,
  PhysicalStatus,
  EventType,
  Story,
  CelestialBodyDto,
  MachineSummaryDto,
  MachineDetailDto,
  MachineKind,
  MachineState,
  LogbookEntryDto,
  QuizSummaryDto,
  QuizDetailDto,
  QuizAnswerSubmission,
  QuizAttemptResult,
  BadgeDto,
  VisitorProgressDto,
  AccountDto,
  AuthSessionDto,
  MeResponseDto,
  RegisterPayload,
  LoginPayload,
} from '../types/models';
import { MOCK_EQUIPMENTS, MOCK_STORIES } from './mockData';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1').replace(/\/+$/, '');
const TOKEN_STORAGE_KEY = 'space_legacy_token';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function mapKindToEquipmentType(kind: MachineKind): EquipmentType {
  switch (kind) {
    case 'ROVER':
      return 'ROVER';
    case 'LANDER':
      return 'LANDER';
    case 'ORBITER':
      return 'ORBITER';
    case 'HELICOPTER':
      return 'SPACECRAFT';
    case 'LANDING_CRAFT_STAGE':
      return 'STAGE';
    case 'INSTRUMENT':
      return 'SCIENTIFIC_INSTRUMENT';
    default:
      return 'OTHER';
  }
}

function mapStateToStatuses(state: MachineState): { operational: OperationalStatus; physical: PhysicalStatus } {
  switch (state) {
    case 'STILL_ACTIVE':
      return { operational: 'OPERATIONAL', physical: 'LEFT_ON_SURFACE' };
    case 'STOPPED_ANSWERING':
      return { operational: 'INACTIVE', physical: 'LEFT_ON_SURFACE' };
    case 'JOB_FINISHED':
      return { operational: 'MISSION_ENDED', physical: 'LEFT_ON_SURFACE' };
    case 'LEFT_ON_PURPOSE':
      return { operational: 'MISSION_ENDED', physical: 'LEFT_ON_SURFACE' };
    default:
      return { operational: 'UNKNOWN', physical: 'UNKNOWN' };
  }
}

export function machineSummaryToEquipment(item: MachineSummaryDto): Equipment {
  const editorial = MOCK_EQUIPMENTS.find(
    (e) => e.slug === item.slug || (item.slug.includes('apollo-11') && e.slug.includes('apollo-11'))
  );
  const { operational, physical } = mapStateToStatuses(item.state);

  return {
    ...editorial,
    equipmentId: item.id,
    name: item.name,
    slug: item.slug,
    description: item.summary,
    equipmentType: mapKindToEquipmentType(item.kind),
    operationalStatus: operational,
    physicalStatus: physical,
    celestialBodyName: item.body?.name || (item.slug.includes('mars') ? 'Mars' : 'Moon'),
    hook: item.summary,
    mainImageUrl: item.coverImage?.path || editorial?.mainImageUrl || 'https://images.nasa.gov/images/placeholder.jpg',
    machineId: item.id,
    kind: item.kind,
    state: item.state,
    stateSince: item.stateSince,
    arrivalYear: item.arrivalYear,
    launchYear: item.launchYear,
  };
}

export function machineDetailToEquipment(detail: MachineDetailDto): Equipment {
  const editorial = MOCK_EQUIPMENTS.find(
    (e) => e.slug === detail.slug || (detail.slug.includes('apollo-11') && e.slug.includes('apollo-11'))
  );
  const { operational, physical } = mapStateToStatuses(detail.state);

  const events = (detail.events || []).map((e, idx) => ({
    event: {
      eventId: e.id,
      missionId: detail.id,
      title: e.title,
      description: e.description,
      eventType: (e.title.toLowerCase().includes('landing')
        ? 'LANDING'
        : e.title.toLowerCase().includes('launch')
          ? 'LAUNCH'
          : e.title.toLowerCase().includes('contact') || e.title.toLowerCase().includes('signal')
            ? 'LAST_SIGNAL'
            : 'OTHER') as EventType,
      eventDate: e.dateIso || e.dateLabel,
      datePrecision: 'EXACT' as const,
      sequenceOrder: e.sortOrder ?? idx,
      sources: e.source
        ? [
            {
              sourceId: e.source.id,
              title: e.source.title,
              publisher: e.source.publisher,
              url: e.source.url,
              sourceType: 'OFFICIAL_DOCUMENT' as const,
            },
          ]
        : [],
    },
    roleInEvent: 'Primary Subject',
  }));

  const measurements = (detail.facts || []).map((f) => ({
    measurementId: f.id,
    name: f.label,
    value: parseFloat(f.value) || 0,
    unit: f.unit || '',
    context: f.label,
    measurementType: 'OTHER' as const,
  }));

  const sources = (detail.sources || []).map((s) => ({
    sourceId: s.id,
    title: s.title,
    publisher: s.publisher,
    url: s.url,
    sourceType: 'OFFICIAL_DOCUMENT' as const,
  }));

  const coverImg = detail.images?.find((img) => img.isCover) || detail.images?.[0];
  const mainImg = coverImg?.path || editorial?.mainImageUrl || 'https://images.nasa.gov/images/placeholder.jpg';

  return {
    ...editorial,
    equipmentId: detail.id,
    name: detail.name,
    slug: detail.slug,
    description: detail.description || detail.summary,
    overview: detail.howItWorked || detail.missionPurpose,
    equipmentType: mapKindToEquipmentType(detail.kind),
    operationalStatus: operational,
    physicalStatus: physical,
    celestialBodyName: detail.body?.name || 'Moon / Mars',
    hook: detail.summary,
    mainImageUrl: mainImg,
    events: events.length > 0 ? events : editorial?.events,
    measurements: measurements.length > 0 ? measurements : editorial?.measurements,
    sources: sources.length > 0 ? sources : editorial?.sources,
    discoveries: detail.discoveries ? [detail.discoveries] : editorial?.discoveries,
    machineId: detail.id,
    kind: detail.kind,
    state: detail.state,
    stateSince: detail.stateSince,
    arrivalYear: detail.arrivalYear,
    launchYear: detail.launchYear,
    facts: detail.facts,
    rawEvents: detail.events,
    sourcesList: detail.sources,
    imagesList: detail.images,
    howItWorked: detail.howItWorked,
    missionPurpose: detail.missionPurpose,
    currentStatusNote: detail.currentStatusNote,
    latitude: detail.latitude,
    longitude: detail.longitude,
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          `Impossible de joindre le serveur API (${API_BASE_URL}). Assurez-vous qu'il est en cours d'exécution.`
        );
      }
      throw error;
    }

    const responseText = await response.text();
    let body: any = null;
    if (responseText) {
      try {
        body = JSON.parse(responseText);
      } catch {
        body = responseText;
      }
    }

    if (!response.ok) {
      const message =
        body?.error?.message ||
        body?.message ||
        `Erreur serveur (${response.status} ${response.statusText})`;
      throw new ApiError(response.status, message, body?.error?.details || body);
    }

    // Unpack Hono standard envelope { success: true, data: ... } if present
    if (body && typeof body === 'object' && body.success === true && 'data' in body) {
      return body.data as T;
    }

    return body as T;
  }

  /**
   * Health Probe
   */
  async checkConnection(): Promise<string> {
    try {
      const res = await this.request<{ status: string }>('/health/live');
      return res?.status || 'ok';
    } catch (err) {
      // Fallback probe
      const fallback = await fetch(`${API_BASE_URL}/health/live`).catch(() => null);
      if (fallback && fallback.ok) return 'ok';
      throw err;
    }
  }

  /**
   * Initialize or retrieve active anonymous session
   */
  async initSession(): Promise<{ token: string; visitorId: string; isAnonymous: boolean }> {
    const currentToken = this.getToken();
    const headers: Record<string, string> = {};
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const result = await this.request<{ token: string; visitorId: string; isAnonymous: boolean }>(
      '/session/anonymous',
      { method: 'POST', headers }
    );

    if (result?.token) {
      this.setToken(result.token);
    }
    return result;
  }

  /**
   * Register a new account.
   * If current visitor has an anonymous session, the Bearer token is automatically sent
   * so the backend links all preexisting attempts, badges, and progress to the new account!
   */
  async register(payload: RegisterPayload): Promise<AuthSessionDto> {
    const result = await this.request<AuthSessionDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result?.token) {
      this.setToken(result.token);
    }
    return result;
  }

  /**
   * Login to an existing account.
   * If current visitor has an anonymous session, the Bearer token is automatically sent
   * so the backend merges all anonymous attempts and badges into the account!
   */
  async login(payload: LoginPayload): Promise<AuthSessionDto> {
    const result = await this.request<AuthSessionDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result?.token) {
      this.setToken(result.token);
    }
    return result;
  }

  /**
   * Logout from the authenticated session.
   * Invalidates token on server, clears localStorage, and re-initializes
   * a fresh anonymous visitor session.
   */
  async logout(): Promise<void> {
    const currentToken = this.getToken();
    if (currentToken) {
      try {
        await this.request<{ success: boolean }>('/auth/logout', { method: 'POST' });
      } catch {
        // Ignore network / token expiration errors during logout
      }
    }
    this.clearToken();
    await this.initSession();
  }

  /**
   * Retrieve active user / session profile (/me)
   */
  async getMe(): Promise<MeResponseDto> {
    return this.request<MeResponseDto>('/me');
  }

  /**
   * Celestial Bodies
   */
  async getBodies(): Promise<CelestialBodyDto[]> {
    const res = await this.request<{ bodies: CelestialBodyDto[] }>('/bodies');
    return res.bodies || [];
  }

  /**
   * Machines (Catalogue / Explorer)
   */
  async getMachines(params?: {
    body?: string;
    kind?: string;
    state?: string;
    decade?: number;
    q?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    data: MachineSummaryDto[];
    pagination: { nextCursor: string | null; hasMore: boolean; total: number };
    facets?: Record<string, Record<string, number>>;
  }> {
    const query = new URLSearchParams();
    if (params?.body) query.set('body', params.body);
    if (params?.kind) query.set('kind', params.kind);
    if (params?.state) query.set('state', params.state);
    if (params?.decade) query.set('decade', String(params.decade));
    if (params?.q) query.set('q', params.q);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.cursor) query.set('cursor', params.cursor);

    const qs = query.toString();
    const endpoint = `/machines${qs ? `?${qs}` : ''}`;
    return this.request<{
      data: MachineSummaryDto[];
      pagination: { nextCursor: string | null; hasMore: boolean; total: number };
      facets?: Record<string, Record<string, number>>;
    }>(endpoint);
  }

  /**
   * Single Machine Details
   */
  async getMachineBySlug(slug: string): Promise<MachineDetailDto> {
    const res = await this.request<{ machine: MachineDetailDto }>(`/machines/${encodeURIComponent(slug)}`);
    return res.machine;
  }

  /**
   * Machine Logbook Entries
   */
  async getMachineLogbook(slug: string): Promise<{
    machine: { id: string; slug: string; name: string };
    entries: LogbookEntryDto[];
  }> {
    const res = await this.request<{
      machine: { id: string; slug: string; name: string };
      entries: LogbookEntryDto[];
      data?: LogbookEntryDto[];
    }>(`/machines/${encodeURIComponent(slug)}/logbook`);
    return {
      machine: res.machine,
      entries: res.entries || res.data || [],
    };
  }

  /**
   * High-level Equipment adapter (populates from authentic Machines API)
   */
  async getEquipments(): Promise<Equipment[]> {
    try {
      const res = await this.getMachines({ limit: 50 });
      if (res?.data && res.data.length > 0) {
        return res.data.map(machineSummaryToEquipment);
      }
    } catch (e) {
      console.warn('API getMachines failed, falling back to editorial data:', e);
    }
    return MOCK_EQUIPMENTS;
  }

  /**
   * High-level Equipment detail adapter
   */
  async getEquipmentBySlug(slug: string): Promise<Equipment | null> {
    try {
      const detail = await this.getMachineBySlug(slug);
      if (detail) {
        return machineDetailToEquipment(detail);
      }
    } catch (e) {
      console.warn(`API getMachineBySlug(${slug}) failed, falling back:`, e);
    }
    const editorial = MOCK_EQUIPMENTS.find((e) => e.slug === slug);
    return editorial || null;
  }

  /**
   * Quizzes List
   */
  async getQuizzes(params?: { body?: string; machine?: string; level?: string }): Promise<QuizSummaryDto[]> {
    const query = new URLSearchParams();
    if (params?.body) query.set('body', params.body);
    if (params?.machine) query.set('machine', params.machine);
    if (params?.level) query.set('level', params.level);

    const qs = query.toString();
    const endpoint = `/quizzes${qs ? `?${qs}` : ''}`;
    const res = await this.request<{ quizzes: QuizSummaryDto[] }>(endpoint);
    return res.quizzes || [];
  }

  /**
   * Single Quiz Detail with questions & options
   */
  async getQuizBySlug(slug: string): Promise<QuizDetailDto> {
    const res = await this.request<{ quiz: QuizDetailDto }>(`/quizzes/${encodeURIComponent(slug)}`);
    return res.quiz;
  }

  /**
   * Submit Quiz Attempt
   */
  async submitQuizAttempt(
    slug: string,
    answers: QuizAnswerSubmission[]
  ): Promise<QuizAttemptResult> {
    // Ensure session exists
    if (!this.getToken()) {
      await this.initSession();
    }
    return this.request<QuizAttemptResult>(`/quizzes/${encodeURIComponent(slug)}/attempts`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  /**
   * Badges List
   */
  async getBadges(): Promise<BadgeDto[]> {
    const res = await this.request<{ badges: BadgeDto[] }>('/badges');
    return res.badges || [];
  }

  /**
   * Visitor Progress (completed quizzes, unlocked badges)
   */
  async getProgress(): Promise<VisitorProgressDto | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await this.request<{ progress: VisitorProgressDto }>('/me/progress');
      return res.progress;
    } catch {
      return null;
    }
  }

  /**
   * Stories & Editorial Narratives
   */
  async getStories(): Promise<Story[]> {
    return MOCK_STORIES;
  }

  async getStoryBySlug(slug: string): Promise<Story | null> {
    const story = MOCK_STORIES.find((s) => s.slug === slug || s.slug.includes(slug));
    return story || null;
  }

  /**
   * Museum Statistics
   */
  async getStats(equipmentsList?: Equipment[]): Promise<{
    equipmentsCount: number;
    missionsCount: number;
    yearsSpan: number;
    celestialBodiesCount: number;
    quizzesCount: number;
  }> {
    let count = equipmentsList?.length || 0;
    let celestialBodiesCount = 2;
    let quizzesCount = 26;

    try {
      const [bodies, quizzes] = await Promise.all([
        this.getBodies().catch(() => []),
        this.getQuizzes().catch(() => []),
      ]);
      if (bodies.length > 0) celestialBodiesCount = bodies.length;
      if (quizzes.length > 0) quizzesCount = quizzes.length;
    } catch {
      // ignore
    }

    return {
      equipmentsCount: count > 0 ? count : 7,
      missionsCount: 12,
      yearsSpan: 57,
      celestialBodiesCount,
      quizzesCount,
    };
  }
}

export const api = new ApiService();
