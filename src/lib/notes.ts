import type { FieldNote } from "./products";

export type NoteSort = "newest" | "highest";

export function isNoteSort(value: string): value is NoteSort {
  return value === "newest" || value === "highest";
}

export function sortNotes(notes: FieldNote[], sort: NoteSort): FieldNote[] {
  const copy = [...notes];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    case "highest":
      return copy.sort((a, b) => b.rating - a.rating || (a.date < b.date ? 1 : -1));
    default: {
      const exhaustive: never = sort;
      return exhaustive;
    }
  }
}

const noteDateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function formatNoteDate(isoDate: string): string {
  return noteDateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}
