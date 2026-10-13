"use client";

import { useMemo, useState } from "react";
import { formatNoteDate, isNoteSort, sortNotes, type NoteSort } from "@/lib/notes";
import type { FieldNote } from "@/lib/products";

export function FieldNotes({ notes }: { notes: FieldNote[] }) {
  const [sort, setSort] = useState<NoteSort>("newest");
  const ordered = useMemo(() => sortNotes(notes, sort), [notes, sort]);

  return (
    <div>
      <div className="sort-row">
        <label htmlFor="note-sort">Sort notes</label>
        <select
          id="note-sort"
          value={sort}
          onChange={(event) => {
            const next = event.target.value;
            if (isNoteSort(next)) setSort(next);
          }}
        >
          <option value="newest">Newest</option>
          <option value="highest">Highest rated</option>
        </select>
      </div>
      <ul className="note-list">
        {ordered.map((note) => (
          <li key={note.id}>
            <article>
              <h3>{note.author}</h3>
              <p>{note.body}</p>
              <p className="note-meta">
                <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
                <span> · {note.rating} out of 5</span>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
