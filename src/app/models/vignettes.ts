export interface Vignette {
  img?: string;
  alt?: string;
  link?: string;
  id?: string;
  downloadUrl?: string;
  path?: string;
  projectId?: string;
  position?: number;
}

export interface Grid {
  cols: number;
  gutterSize: number;
}
