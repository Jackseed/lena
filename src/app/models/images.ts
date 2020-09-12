export interface Image {
  id: string;
  downloadUrl?: string;
  path?: string;
  caption?: string;
  position?: number;
  video?: {
    isVideo?: boolean;
    poster?: string;
  };
}
