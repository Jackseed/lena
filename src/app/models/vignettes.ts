export const Tiles = [
  { img: "vignette-paulette.jpg", alt: "Paulette", link: "pauletteweb" },
  {
    img: "vignette-illustrations2.jpg",
    alt: "Illustrations 2",
    link: "illustrations2",
  },
  { img: "vignette-carto.jpg", alt: "Cartoactium", link: "cartoactium" },
  {
    img: "vignette-couvertures.jpg",
    alt: "Collection XXI",
    link: "collectionxxi",
  },
  {
    img: "vignette-cfs.jpg",
    alt: "Chill, Farm & Sun",
    link: "chillfarmandsun",
  },
  {
    img: "vignette-contact.jpg",
    alt: "Illustrations 1",
    link: "illustrations1",
  },
  { img: "vignette-monsters.jpg", alt: "Sérigraphie", link: "serigraphie" },
  {
    img: "vignette-gifpaulette.gif",
    alt: "Paulette Gif",
    link: "paulettegif",
  },
  { img: "vignette-GIF-yeux.gif", alt: "Gifs", link: "gifs" },
  {
    img: "vignette-feelslikehome.jpg",
    alt: "Feels like home",
    link: "feelslikehome",
  },
  {
    img: "vignette-pictos.jpg",
    alt: "Pictos bateaux",
    link: "pictosbateaux",
  },
  {
    img: "vignette-illustrations3.jpg",
    alt: "Illustrations 3",
    link: "illustrations3",
  },
  {
    img: "vignette-illustrations1.jpg",
    alt: "Illustrations 1",
    link: "illustrations1",
  },
  { img: "vignette-m2.jpg", alt: "m2", link: "m2" },
  { img: "vignette_paulette.jpg", alt: "Paulette", link: "paulette" },
  { img: "vignette-saul.jpg", alt: "Saul Bass Walk", link: "saulbasswalk" },
];

export interface Tile {
  img: string;
  alt: string;
  link: string;
}

export interface Grid {
  cols: number;
  gutterSize: number;
}
