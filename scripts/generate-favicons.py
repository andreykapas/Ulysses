"""Generate favicon PNG/ICO assets from Ulysses brand colors."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "img"

BG = (11, 31, 42, 255)
GOLD = (217, 164, 91, 255)
FONT_PATH = Path(r"C:\Windows\Fonts\georgiab.ttf")


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    if FONT_PATH.exists():
        return ImageFont.truetype(str(FONT_PATH), size)
    return ImageFont.load_default()


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    pad = size * 0.11
    apex = (size / 2, pad)
    left = (pad, size - pad)
    right = (size - pad, size - pad)
    width = max(1, round(size / 18))

    draw.polygon([apex, left, right], outline=GOLD, width=width)

    font_size = round(size * 0.42)
    font = load_font(font_size)
    letter = "U"
    bbox = draw.textbbox((0, 0), letter, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) / 2 - bbox[0]
    y = size * 0.52 - text_h / 2 - bbox[1]
    draw.text((x, y), letter, font=font, fill=GOLD)

    return img.convert("RGBA")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    png_sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "favicon-64x64.png": 64,
        "apple-touch-icon.png": 180,
    }

    for name, size in png_sizes.items():
        draw_icon(size).save(OUT / name, format="PNG")

    master = draw_icon(256)
    master.save(
        OUT / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    print("Wrote favicons to", OUT)

    root_ico = ROOT / "favicon.ico"
    root_ico.write_bytes((OUT / "favicon.ico").read_bytes())
    print("Copied to", root_ico)


if __name__ == "__main__":
    main()
