#!/usr/bin/env python3
"""Render flat screen-print product art as PNG. Converted to WebP afterward."""

import struct
import zlib
from pathlib import Path

OUT = Path("public/images")
OUT.mkdir(parents=True, exist_ok=True)

INK = (28, 36, 32)
PINE = (35, 66, 55)
PINE_DEEP = (22, 46, 38)
PINE_MID = (52, 92, 76)
SAND = (230, 211, 184)
SAND_DEEP = (196, 168, 132)
PAPER = (244, 241, 234)
COPPER = (196, 98, 45)
COPPER_DEEP = (140, 62, 28)
CREAM = (255, 250, 242)
SUN = (232, 176, 122)


def write_png(path: Path, w: int, h: int, buf: bytearray) -> None:
    raw = bytearray()
    stride = w * 3
    for y in range(h):
        raw.append(0)
        start = y * stride
        raw.extend(buf[start : start + stride])

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    path.write_bytes(png)


def blank(w: int, h: int, color: tuple[int, int, int]) -> bytearray:
    return bytearray(color) * (w * h)


def fill_rect(
    buf: bytearray,
    w: int,
    h: int,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    color: tuple[int, int, int],
) -> None:
    x0 = max(0, x0)
    x1 = min(w, x1)
    y0 = max(0, y0)
    y1 = min(h, y1)
    if x1 <= x0 or y1 <= y0:
        return
    row = bytes(color) * (x1 - x0)
    span = (x1 - x0) * 3
    for y in range(y0, y1):
        i = (y * w + x0) * 3
        buf[i : i + span] = row


def fill_circle(
    buf: bytearray,
    w: int,
    h: int,
    cx: int,
    cy: int,
    r: int,
    color: tuple[int, int, int],
) -> None:
    r2 = r * r
    for y in range(max(0, cy - r), min(h, cy + r + 1)):
        dy = y - cy
        span = int((r2 - dy * dy) ** 0.5)
        fill_rect(buf, w, h, cx - span, y, cx + span, y + 1, color)


def fill_poly(
    buf: bytearray,
    w: int,
    h: int,
    pts: list[tuple[float, float]],
    color: tuple[int, int, int],
) -> None:
    ys = [p[1] for p in pts]
    y0 = max(0, int(min(ys)))
    y1 = min(h - 1, int(max(ys)))
    n = len(pts)
    for y in range(y0, y1 + 1):
        xs: list[float] = []
        for i in range(n):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % n]
            if y1 == y2:
                continue
            if (y1 <= y < y2) or (y2 <= y < y1):
                t = (y - y1) / (y2 - y1)
                xs.append(x1 + t * (x2 - x1))
        xs.sort()
        for i in range(0, len(xs) - 1, 2):
            fill_rect(buf, w, h, int(xs[i]), y, int(xs[i + 1]) + 1, y + 1, color)


def hero() -> None:
    w, h = 1400, 900
    buf = blank(w, h, (24, 40, 46))
    for y in range(h):
        t = y / (h - 1)
        color = (
            int(24 + t * 28),
            int(40 + t * 36),
            int(46 + t * 18),
        )
        fill_rect(buf, w, h, 0, y, w, y + 1, color)
    fill_circle(buf, w, h, 1088, 230, 108, COPPER)
    fill_circle(buf, w, h, 1088, 230, 64, SUN)
    fill_poly(
        buf,
        w,
        h,
        [(0, 900), (0, 560), (280, 470), (560, 590), (860, 420), (1160, 560), (1400, 470), (1400, 900)],
        PINE_MID,
    )
    fill_poly(
        buf,
        w,
        h,
        [(0, 900), (0, 680), (240, 600), (520, 740), (820, 560), (1100, 700), (1400, 600), (1400, 900)],
        PINE,
    )
    fill_poly(
        buf,
        w,
        h,
        [(0, 900), (80, 760), (360, 820), (640, 700), (980, 820), (1400, 720), (1400, 900)],
        PINE_DEEP,
    )
    fill_poly(buf, w, h, [(470, 730), (590, 500), (710, 730)], SAND)
    fill_poly(buf, w, h, [(590, 500), (640, 730), (540, 730)], SAND_DEEP)
    fill_rect(buf, w, h, 575, 620, 605, 730, PINE_DEEP)
    write_png(OUT / "hero.png", w, h, buf)


def product(name: str, disc: tuple[int, int, int], draw) -> None:
    w = h = 800
    buf = blank(w, h, PAPER)
    fill_circle(buf, w, h, 400, 430, 280, (226, 216, 202))
    fill_circle(buf, w, h, 400, 400, 250, disc)
    draw(buf, w, h)
    write_png(OUT / f"{name}.png", w, h, buf)


def jacket(buf: bytearray, w: int, h: int) -> None:
    fill_poly(buf, w, h, [(300, 250), (500, 250), (540, 620), (260, 620)], INK)
    fill_poly(buf, w, h, [(300, 250), (250, 430), (330, 390), (320, 300)], INK)
    fill_poly(buf, w, h, [(500, 250), (550, 430), (470, 390), (480, 300)], INK)
    fill_rect(buf, w, h, 360, 250, 440, 330, COPPER)
    fill_rect(buf, w, h, 385, 330, 415, 470, COPPER_DEEP)


def pack(buf: bytearray, w: int, h: int) -> None:
    fill_rect(buf, w, h, 255, 300, 310, 540, PINE_DEEP)
    fill_rect(buf, w, h, 490, 300, 545, 540, PINE_DEEP)
    fill_rect(buf, w, h, 300, 230, 500, 590, PINE)
    fill_rect(buf, w, h, 330, 280, 470, 370, SAND)
    fill_rect(buf, w, h, 360, 470, 440, 520, COPPER)


def beanie(buf: bytearray, w: int, h: int) -> None:
    fill_circle(buf, w, h, 400, 390, 150, COPPER)
    fill_rect(buf, w, h, 260, 390, 540, 500, COPPER_DEEP)
    fill_rect(buf, w, h, 260, 470, 540, 520, CREAM)
    fill_circle(buf, w, h, 400, 230, 26, CREAM)


def mug(buf: bytearray, w: int, h: int) -> None:
    fill_circle(buf, w, h, 530, 410, 78, INK)
    fill_circle(buf, w, h, 530, 410, 46, (214, 196, 168))
    fill_rect(buf, w, h, 280, 270, 500, 560, CREAM)
    fill_rect(buf, w, h, 280, 270, 500, 340, COPPER)
    fill_rect(buf, w, h, 280, 520, 500, 560, INK)


def lantern(buf: bytearray, w: int, h: int) -> None:
    fill_rect(buf, w, h, 372, 180, 428, 250, INK)
    fill_rect(buf, w, h, 300, 250, 500, 320, INK)
    fill_rect(buf, w, h, 325, 320, 475, 530, (255, 214, 150))
    fill_rect(buf, w, h, 390, 340, 410, 500, COPPER)
    fill_rect(buf, w, h, 300, 520, 500, 580, INK)


def socks(buf: bytearray, w: int, h: int) -> None:
    fill_rect(buf, w, h, 280, 210, 380, 560, CREAM)
    fill_rect(buf, w, h, 420, 210, 520, 560, CREAM)
    fill_rect(buf, w, h, 280, 210, 380, 270, COPPER)
    fill_rect(buf, w, h, 420, 210, 520, 270, PINE)
    fill_rect(buf, w, h, 280, 470, 450, 560, COPPER)
    fill_rect(buf, w, h, 420, 470, 590, 560, PINE)


def main() -> None:
    hero()
    product("field-jacket", (232, 214, 190), jacket)
    product("daypack", (214, 196, 168), pack)
    product("merino-beanie", (232, 214, 190), beanie)
    product("enamel-mug", (214, 196, 168), mug)
    product("trail-lantern", (232, 220, 196), lantern)
    product("merino-socks", (214, 196, 168), socks)


if __name__ == "__main__":
    main()
