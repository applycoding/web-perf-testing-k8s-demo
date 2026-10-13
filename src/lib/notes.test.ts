import { formatNoteDate, sortNotes } from "./notes";
import type { FieldNote } from "./products";

const notes: FieldNote[] = [
  {
    id: "a",
    author: "A",
    date: "2026-01-01",
    body: "Older",
    rating: 5,
  },
  {
    id: "b",
    author: "B",
    date: "2026-06-01",
    body: "Newer",
    rating: 3,
  },
];

describe("sortNotes", () => {
  it("orders newest first", () => {
    expect(sortNotes(notes, "newest").map((note) => note.id)).toEqual(["b", "a"]);
  });

  it("orders by rating", () => {
    expect(sortNotes(notes, "highest").map((note) => note.id)).toEqual(["a", "b"]);
  });

  it("does not mutate the input", () => {
    sortNotes(notes, "newest");
    expect(notes.map((note) => note.id)).toEqual(["a", "b"]);
  });
});

describe("formatNoteDate", () => {
  it("formats a calendar date in UTC", () => {
    expect(formatNoteDate("2026-03-02")).toBe("Mar 2, 2026");
  });
});
