export interface Category {
  id?: string;
  name?: string;
  downloadUrl?: string;
  path?: string;
  position?: number;
  projectIds?: {
    id: string;
    position: number;
  }[];
}
