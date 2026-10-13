export interface WorkshopNote {
  id: string;
  title: string;
  body: string;
}

export const workshopNotes: WorkshopNote[] = [
  {
    id: "wax",
    title: "Wax, not a membrane",
    body: "The field jacket sheds a shower because of wax, and it can be rewaxed on a kitchen table. That is the repair story we want.",
  },
  {
    id: "weight",
    title: "Weight on the tag",
    body: "Every product lists grams. If a piece does not earn the weight in a three-day pack, it does not make the catalog.",
  },
  {
    id: "warmth",
    title: "Warm light after dark",
    body: "The lantern stays at 2700K. Cooler light is brighter on paper and worse at a shared table.",
  },
  {
    id: "socks",
    title: "Flat seams",
    body: "The sock seam is the thing you notice at mile eight. We specify it because the rest of the sock is easy to copy.",
  },
];
