export interface StorySummary {
  storyId: string;
  title: string;
  slug: string;
  hook?: string | null;
  durationSeconds?: number | null;
  storyType: string;
}
