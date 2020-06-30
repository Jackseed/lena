export interface Category {
  id?: string;
  name?: string;
  downloadUrl?: string,
  path?: string,
  position?: number;
  projectIds?: {
    id: string;
    position: number;
  }[];
}

export const MenuTitles = [
  { name: "graphisme", img: "menu-graphisme.jpg" },
  { name: "illustration", img: "menu-illustration.jpg" },
  { name: "animation", img: "menu-animation.jpg" },
  { name: "contact", img: "menu-contact.jpg" },
];
