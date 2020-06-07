export interface Project {
  id?: string;
  position?: number;
  section?: string;
  title?: string;
  link?: string;
  description?: string;
  caption?: string;
  images?: {
    downloadUrl: string;
    path: string;
    caption: string;
  }[];
  images0?: string[];
  legende1?: string[];
  images1?: string[];
  legende2?: string[];
  images2?: string[];
  legende3?: string[];
  images3?: string[];
  legende4?: string[];
  images4?: string[];
  legende5?: string[];
  images5?: string[];
  legende_finale?: string[];
  copyright?: string;
  signature?: string;
}

export function createProject(p: Partial<Project>): Project {
  const project = {
    id: p.id,
    title: p.title,
    description: p.description,
    caption: p.caption,
    images: [],
  };
  if (p.images?.length > 0) {
    for (const image of p.images) {
      project.images.push(image);
    }
  }
  return project;
}

export const Projects = [
  {
    section: "graphisme",
    title: "Le Monde des enfants",
    link: "lemondedesenfants",
    description:
      // tslint:disable-next-line: max-line-length
      "Conception d'un supplément hebdomadaire au journal Le Monde. Le Monde des Enfants, pour expliquer l'actualité aux enfants avec des mots simples : C'est où la  Syrie ? Et pourquoi on en parle ? Papa, un coeur greffé il peut tomber amoureux ? Et pourquoi il fait si froid à Chigaco alors qu'on dit que la terre elle se réchauffe ?",
    caption: "La Cambre, 2014.",
    images0: [
      "lmde_1.jpg",
      "lmde_2.jpg",
      "lmde_3.jpg",
      "lmde_4.jpg",
      "lmde_5.jpg",
      "lmde_6.jpg",
    ],
    legende1: ["Version web"],
    images1: [
      "lmde-laptop1.jpg",
      "lmde-laptop2.jpg",
      "lmde-laptop2bis.jpg",
      "lmde-laptop3.jpg",
      "lmde-smartphone.jpg",
    ],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    // tslint:disable-next-line: max-line-length
    legende_finale: [
      // tslint:disable-next-line: max-line-length
      "/!\\ Ce que je n'ai pas dessiné ou écrit moi-même pour ce projet a été emprunté à 1jour1actu, Jacques Azam, Marie Assénat, Hector Dexet. Ce projet ne sera diffusé nulle part ailleurs sans leur autorisation préalable. Merci à eux.",
    ],
    copyright: "Graphisme - Illustration",
    signature: "Lena Piroux 2016",
  },
  {
    section: "graphisme",
    title: "College 75",
    link: "college75",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "Chill, Farm & Sun",
    link: "chillfarmandsun",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "Les Silences de Palomar",
    link: "palomar",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "Manuel Typographique",
    link: "manueltypo",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "Couvertures de livres",
    link: "collectionxxi",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "m²",
    link: "m2",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "Cartographie",
    link: "cartoactium",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "L'établi - logo",
    link: "letabli",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "ReadMyBook",
    link: "readmybook",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "graphisme",
    title: "La Cabine - logo",
    link: "lacabine",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Illustrations I",
    link: "illustrations1",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Illustrations II",
    link: "illustrations2",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Illustrations III",
    link: "illustrations3",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Paulette Magazine",
    link: "paulette",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Paulette Magazine web",
    link: "pauletteweb",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Feels Like Home",
    link: "feelslikehome",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Make your monsters",
    link: "serigraphie",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Pictogrammes",
    link: "pictosbateaux",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Pourquoi ?",
    link: "pourquoi",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "illustration",
    title: "Carnets",
    link: "carnets",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "animation",
    title: "GIFS",
    link: "gifs",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "animation",
    title: "Les Petites Résolutions Paulette",
    link: "paulettegif",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "animation",
    title: "Matabase",
    link: "matabase",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "animation",
    title: "Saul Bass's Walk to Chaumont",
    link: "saulbasswalk",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
  {
    section: "animation",
    title: "ReadMyBook - animation",
    link: "readmybookgif",
    description: "",
    caption: "",
    images: [],
    legende1: [],
    images1: [],
    legende2: [],
    images2: [],
    legende3: [],
    images3: [],
    legende4: [],
    images4: [],
    legende5: [],
    images5: [],
    legende_finale: [],
    copyright: "",
    signature: "",
  },
];
