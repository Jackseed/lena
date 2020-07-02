export interface Project {
  id?: string;
  position?: number;
  categoryId?: string;
  title?: string;
  link?: string;
  description?: string;
  caption?: string;
  status?: "draft" | "published";
  finalCaption?: string;
}
