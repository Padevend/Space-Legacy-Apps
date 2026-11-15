// ======================================================
// ENUMS (Strict alignment with schema.prisma)
// ======================================================

export type MissionStatus = 
  | 'PLANNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'PARTIALLY_COMPLETED'
  | 'FAILED'
  | 'UNKNOWN';

export type EquipmentType =
  | 'SPACECRAFT'
  | 'LANDER'
  | 'ROVER'
  | 'ORBITER'
  | 'MODULE'
  | 'STAGE'
  | 'SCIENTIFIC_INSTRUMENT'
  | 'COMPONENT'
  | 'ARTIFACT'
  | 'OTHER';

export type OperationalStatus =
  | 'OPERATIONAL'
  | 'INACTIVE'
  | 'MISSION_ENDED'
  | 'FAILED'
  | 'UNKNOWN';

export type PhysicalStatus =
  | 'LEFT_ON_SURFACE'
  | 'IN_ORBIT'
  | 'RETURNED_TO_EARTH'
  | 'DESTROYED'
  | 'LOST'
  | 'UNKNOWN';

export type EventType =
  | 'LAUNCH'
  | 'LANDING'
  | 'FLYBY'
  | 'ORBIT_INSERTION'
  | 'DEPLOYMENT'
  | 'ACTIVATION'
  | 'SCIENTIFIC_DISCOVERY'
  | 'COMMUNICATION'
  | 'LAST_SIGNAL'
  | 'MISSION_END'
  | 'OTHER';

export type DatePrecision =
  | 'EXACT'
  | 'ESTIMATED'
  | 'YEAR_ONLY'
  | 'MONTH_ONLY'
  | 'UNKNOWN';

export type CelestialBodyType =
  | 'STAR'
  | 'PLANET'
  | 'MOON'
  | 'ASTEROID'
  | 'DWARF_PLANET'
  | 'COMET'
  | 'OTHER';

export type LocationType =
  | 'LAUNCH_SITE'
  | 'LANDING_SITE'
  | 'SURFACE_LOCATION'
  | 'ORBIT'
  | 'SPACE_REGION'
  | 'FACILITY'
  | 'OTHER';

export type SourceType =
  | 'OFFICIAL_DOCUMENT'
  | 'SCIENTIFIC_PAPER'
  | 'NASA_WEBPAGE'
  | 'DATASET'
  | 'BOOK'
  | 'ARTICLE'
  | 'VIDEO'
  | 'OTHER';

export type StoryType =
  | 'LEGACY_STORY'
  | 'BEHIND_THE_TECHNOLOGY'
  | 'FINAL_CHAPTER'
  | 'SPACE_FACT';

export type PublicationStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type MediaType =
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'MODEL_3D'
  | 'DOCUMENT'
  | 'ANIMATION'
  | 'OTHER';

export type MediaProvenance =
  | 'NASA_ARCHIVE'
  | '3D_RECONSTRUCTION'
  | 'AI_GENERATED_ILLUSTRATION'
  | 'DATA_VISUALIZATION'
  | 'OTHER';

export type MeasurementType =
  | 'MASS'
  | 'DISTANCE'
  | 'DURATION'
  | 'TEMPERATURE'
  | 'FREQUENCY'
  | 'SPEED'
  | 'FORCE'
  | 'PRESSURE'
  | 'POWER'
  | 'VOLTAGE'
  | 'OTHER';

// ======================================================
// ENTITY MODELS (Mirroring Prisma Models)
// ======================================================

export interface CelestialBody {
  celestialBodyId: string;
  name: string;
  bodyType: CelestialBodyType;
  description?: string | null;
}

export interface Location {
  locationId: string;
  celestialBodyId?: string | null;
  name: string;
  locationType: LocationType;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  referenceSystem?: string | null;
  description?: string | null;
  celestialBody?: CelestialBody | null;
}

export interface Source {
  sourceId: string;
  title: string;
  url: string;
  publisher: string;
  author?: string | null;
  publicationDate?: string | null;
  sourceType: SourceType;
  accessedAt?: string;
}

export interface Media {
  mediaId: string;
  title: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  credit?: string | null;
  creditUrl?: string | null;
  provenanceType: MediaProvenance;
  altText?: string | null;
}

export interface Measurement {
  measurementId: string;
  equipmentId?: string | null;
  eventId?: string | null;
  name: string;
  value: number;
  unit: string;
  measurementType: MeasurementType;
  context: string;
  measurementDate?: string | null;
  isApproximate?: boolean;
  uncertainty?: number | null;
}

export interface Event {
  eventId: string;
  missionId: string;
  title: string;
  description?: string | null;
  eventType: EventType;
  eventDate?: string | null;
  eventTime?: string | null;
  timeStandard?: string | null;
  datePrecision: DatePrecision;
  isEstimated?: boolean;
  sequenceOrder: number;
  location?: Location | null;
  sources?: Source[];
}

export interface Mission {
  missionId: string;
  name: string;
  slug: string;
  description?: string | null;
  agency?: string | null;
  missionStatus: MissionStatus;
  events?: Event[];
  sources?: Source[];
}

export interface Equipment {
  equipmentId: string;
  parentEquipmentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  equipmentType: EquipmentType;
  manufacturer?: string | null;
  operationalStatus: OperationalStatus;
  physicalStatus: PhysicalStatus;
  
  // Relations populated by REST API
  parent?: Equipment | null;
  children?: Equipment[];
  missions?: { mission: Mission; missionRole: string }[];
  events?: { event: Event; roleInEvent?: string | null }[];
  locations?: { location: Location; startDate?: string | null; endDate?: string | null }[];
  media?: { media: Media; representationType?: string | null }[];
  sources?: Source[];
  measurements?: Measurement[];
  stories?: Story[];

  // Editorial enriched fields for UI
  hook?: string;
  overview?: string;
  celestialBodyName?: string;
  mainImageUrl?: string;
  discoveries?: string[];

  // Space Legacy authentic database fields
  machineId?: string;
  kind?: MachineKind;
  state?: MachineState;
  stateSince?: string | null;
  arrivalYear?: number | null;
  launchYear?: number | null;
  facts?: MachineFactDto[];
  rawEvents?: MachineEventDto[];
  sourcesList?: MachineSourceDto[];
  imagesList?: MachineImageDto[];
  logbook?: LogbookEntryDto[];
  howItWorked?: string;
  missionPurpose?: string;
  currentStatusNote?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

// ======================================================
// AUTHENTIC NASA SPACE LEGACY BACKEND MODELS
// ======================================================

export type BackendMachineKind =
  | 'LANDER'
  | 'ROVER'
  | 'HELICOPTER'
  | 'LANDING_CRAFT_STAGE'
  | 'INSTRUMENT'
  | 'ORBITER'
  | 'OTHER';

export type MachineKind = BackendMachineKind;

export type BackendMachineState =
  | 'STILL_ACTIVE'
  | 'STOPPED_ANSWERING'
  | 'JOB_FINISHED'
  | 'LEFT_ON_PURPOSE'
  | 'UNKNOWN';

export type MachineState = BackendMachineState;

export type MediaLabel =
  | 'REAL_PHOTO'
  | 'RECONSTRUCTION'
  | 'AI_ILLUSTRATION'
  | 'DATA_CHART';

export interface CelestialBodyDto {
  id: string;
  slug: string;
  name: string;
  summary: string;
  imagePath?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface MachineSourceDto {
  id: string;
  title: string;
  publisher: string;
  url: string;
}

export interface MachineFactDto {
  id: string;
  label: string;
  value: string;
  unit?: string | null;
  sortOrder?: number;
  source?: MachineSourceDto;
}

export interface MachineEventDto {
  id: string;
  dateLabel: string;
  dateIso?: string | null;
  title: string;
  description: string;
  sortOrder?: number;
  source?: MachineSourceDto;
}

export interface MachineImageDto {
  id: string;
  path: string;
  alt: string;
  label: MediaLabel;
  credit: string;
  sourceUrl?: string | null;
  width: number;
  height: number;
  isCover: boolean;
  sortOrder?: number;
}

export interface MachineSummaryDto {
  id: string;
  slug: string;
  body: {
    id: string;
    slug: string;
    name: string;
  };
  name: string;
  kind: MachineKind;
  state: MachineState;
  stateSince?: string | null;
  launchYear?: number | null;
  arrivalYear?: number | null;
  summary: string;
  coverImage?: MachineImageDto | null;
}

export interface MachineDetailDto {
  id: string;
  slug: string;
  name: string;
  kind: MachineKind;
  state: MachineState;
  stateSince?: string | null;
  launchYear?: number | null;
  arrivalYear?: number | null;
  summary: string;
  description: string;
  missionPurpose: string;
  howItWorked: string;
  discoveries: string;
  currentStatusNote?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  body: CelestialBodyDto;
  events: MachineEventDto[];
  facts: MachineFactDto[];
  images: MachineImageDto[];
  sources: MachineSourceDto[];
}

export interface LogbookEntryDto {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  articleOrigin?: string;
  videoUrl?: string | null;
  videoOrigin?: string | null;
  videoDurationSec?: number | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  machine?: {
    id: string;
    slug: string;
    name: string;
  };
}

export type QuizLevel = 'EXPLORER' | 'EXPERT';

export interface QuizOptionDto {
  id: string;
  label: string;
  sortOrder?: number;
}

export interface QuizQuestionDto {
  id: string;
  prompt: string;
  sortOrder?: number;
  options: QuizOptionDto[];
}

export interface QuizSummaryDto {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  level: QuizLevel;
  body?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  machine?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  questionCount: number;
  createdAt: string;
}

export interface QuizDetailDto {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  level: QuizLevel;
  body?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  machine?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  questions: QuizQuestionDto[];
}

export interface QuizAnswerSubmission {
  questionId: string;
  optionId: string;
}

export interface QuizSubmittedAnswerResult {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
  explanation?: string | null;
}

export interface BadgeDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  rule: string;
  threshold: number;
  body?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  sortOrder: number;
  unlocked?: boolean;
  earnedAt?: string | null;
}

export interface QuizAttemptResult {
  attempt: {
    id: string;
    quizId: string;
    quizSlug: string;
    score: number;
    maxScore: number;
    percentage: number;
    answers: QuizSubmittedAnswerResult[];
    createdAt: string;
  };
  newBadges: BadgeDto[];
}

export interface VisitorProgressDto {
  visitorId: string;
  totalAttempts: number;
  completedQuizzesCount: number;
  perfectScoresCount: number;
  badgesCount: number;
  recentAttempts: Array<{
    id: string;
    quizSlug: string;
    quizTitle: string;
    score: number;
    maxScore: number;
    createdAt: string;
  }>;
  badges: BadgeDto[];
}

export interface Story {
  storyId: string;
  title: string;
  slug: string;
  hook?: string | null;
  content: string;
  storyType: StoryType;
  durationSeconds?: number | null;
  language: string;
  publicationStatus: PublicationStatus;
  publishedAt?: string | null;
  audioUrl?: string | null;
  audioCues?: { paragraphIndex: number; startSeconds: number; endSeconds: number }[] | null;
  equipments?: { equipment: Equipment; narrativeRole?: string | null }[];
  missions?: { mission: Mission }[];
  media?: { media: Media; captionOverride?: string | null }[];
  sources?: Source[];
}

// ======================================================
// AUTH & ACCOUNT TYPES
// ======================================================

export interface AccountDto {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface AuthSessionDto {
  token: string;
  isAnonymous: boolean;
  visitorId: string;
  account: AccountDto | null;
}

export interface MeResponseDto {
  isAnonymous: boolean;
  visitorId: string;
  account: AccountDto | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
