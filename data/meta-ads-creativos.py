"""Genera los creativos estáticos de Meta Ads a partir de las fotos de media/.

Uso:  python3 data/meta-ads-creativos.py  (añade --video para el reel c13)
Salida: media/ads/<id>-4x5.jpg (feed, 1080×1350) y <id>-9x16.jpg (stories/reels, 1080×1920).
En 9:16 el texto importante queda fuera del 14 % superior y del 20 % inferior (los tapa la interfaz de Instagram).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
M = ROOT / "media"
OUT = M / "ads"
OUT.mkdir(exist_ok=True)

INK = (10, 10, 10)
PAPER = (244, 244, 243)
RED = (215, 38, 30)
WHITE = (255, 255, 255)
FONT_DIR = Path("/usr/share/fonts/opentype/inter")


def font(weight, size):
    return ImageFont.truetype(str(FONT_DIR / f"InterDisplay-{weight}.otf"), size)


def cover(path, w, h, focus_y=0.5):
    im = Image.open(path).convert("RGB")
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = (im.width - w) // 2
    y = round((im.height - h) * focus_y)
    return im.crop((x, y, x + w, y + h))


def contain(path, w, h):
    im = Image.open(path).convert("RGB")
    im.thumbnail((w, h), Image.LANCZOS)
    return im


def gradient(w, h, top_alpha, bottom_alpha):
    g = Image.new("L", (1, h))
    for y in range(h):
        g.putpixel((0, y), round(top_alpha + (bottom_alpha - top_alpha) * y / max(h - 1, 1)))
    g = g.resize((w, h))
    layer = Image.new("RGBA", (w, h), INK + (0,))
    layer.putalpha(g)
    return layer


def wrap(draw, text, f, max_w):
    lines = []
    for para in text.split("\n"):
        words, line = para.split(), ""
        for word in words:
            test = f"{line} {word}".strip()
            if draw.textlength(test, font=f) <= max_w:
                line = test
            else:
                lines.append(line)
                line = word
        lines.append(line)
    return lines


def text_block(draw, xy, text, f, fill, max_w, leading=1.05, align="left"):
    x, y = xy
    for line in wrap(draw, text, f, max_w):
        lx = x if align == "left" else x + (max_w - draw.textlength(line, font=f)) / 2
        draw.text((lx, y), line, font=f, fill=fill)
        y += round(f.size * leading)
    return y


def pill(draw, xy, text, f, bg=RED, fg=WHITE, pad=(34, 20), center=False, max_w=None):
    tw = draw.textlength(text, font=f)
    w, h = tw + pad[0] * 2, f.size + pad[1] * 2
    x, y = xy
    if center:
        x = x + (max_w - w) / 2
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h / 2, fill=bg)
    draw.text((x + pad[0], y + pad[1] - f.size * 0.08), text, font=f, fill=fg)
    return y + h


def logo(draw, xy, fill=WHITE, size=38, align="left", w=None):
    f = font("Bold", size)
    x, y = xy
    if align == "center":
        x = x + (w - draw.textlength("arsnoir", font=f)) / 2
    draw.text((x, y), "arsnoir", font=f, fill=fill)


def eyebrow(draw, xy, text, fill=RED, size=30):
    draw.text(xy, text.upper(), font=font("SemiBold", size), fill=fill)


def save(im, name):
    im.convert("RGB").save(OUT / name, quality=90, optimize=True)
    print("✓", name)


# ---------- Layouts ----------

def room_ad(cid, photo, kicker, headline, sub, cta, focus=0.5):
    """Foto de estancia a sangre; el texto va abajo, sobre degradado, para no tapar la obra."""
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = cover(M / photo, W, H, focus).convert("RGBA")
        safe_bot = 64 if fmt == "4x5" else round(H * 0.20)
        im.alpha_composite(gradient(W, round(H * 0.55), 0, 235), (0, H - round(H * 0.55)))
        d = ImageDraw.Draw(im)
        pad = 72
        hf, sf = font("Black", 88), font("Medium", 34)
        h_lines = wrap(d, headline, hf, W - pad * 2)
        s_lines = wrap(d, sub, sf, W - pad * 2) if sub else []
        block = 66 + len(h_lines) * round(hf.size * 1.0) + (14 + len(s_lines) * round(sf.size * 1.25) if s_lines else 0)
        cta_y = H - safe_bot - 84
        y0 = cta_y - 40 - block
        pill(d, (pad, y0), kicker.upper(), font("SemiBold", 24), pad=(16, 10))
        y = text_block(d, (pad, y0 + 66), headline, hf, WHITE, W - pad * 2, 1.0)
        if s_lines:
            text_block(d, (pad, y + 14), sub, sf, (225, 225, 225), W - pad * 2, 1.25)
        pill(d, (pad, cta_y), cta, font("Bold", 34))
        logo(d, (W - pad - 150, cta_y + 18))
        save(im, f"{cid}-{fmt}.jpg")


def styles_ad(cid, cards, kicker, headline, sub, cta):
    """Los estilos de ilustración en cuadrícula, cada uno con su nombre."""
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), PAPER + (255,))
        d = ImageDraw.Draw(im)
        pad = 56
        safe_top = 60 if fmt == "4x5" else round(H * 0.13)
        safe_bot = 56 if fmt == "4x5" else round(H * 0.20)
        eyebrow(d, (pad, safe_top), kicker)
        y = text_block(d, (pad, safe_top + 48), headline, font("Black", 80), INK, W - pad * 2, 1.0)
        y = text_block(d, (pad, y + 8), sub, font("Medium", 32), (90, 90, 90), W - pad * 2, 1.25) + 26
        cols, rows, gap = 3, 2, 12
        area_h = H - safe_bot - 84 - 36 - y
        cw = (W - pad * 2 - gap * (cols - 1)) // cols
        ch = (area_h - gap * (rows - 1)) // rows
        for i, (path, label) in enumerate(cards[: cols * rows]):
            x, ty = pad + (i % cols) * (cw + gap), y + (i // cols) * (ch + gap)
            im.paste(cover(M / path, cw, ch, 0.4), (x, ty))
            pill(d, (x + 10, ty + ch - 52), label, font("SemiBold", 22), bg=WHITE, fg=INK, pad=(14, 10))
        by = y + rows * ch + gap + 24
        pill(d, (pad, by), cta, font("Bold", 34))
        logo(d, (W - pad - 150, by + 18), fill=INK)
        save(im, f"{cid}-{fmt}.jpg")


def before_after(cid, before, after, kicker, headline, sub, cta, after_framed=False):
    """Antes (foto del cliente) → Después (la obra)."""
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), PAPER + (255,))
        d = ImageDraw.Draw(im)
        pad = 64
        safe_top = 64 if fmt == "4x5" else round(H * 0.13)
        safe_bot = 60 if fmt == "4x5" else round(H * 0.20)
        eyebrow(d, (pad, safe_top), kicker)
        y = text_block(d, (pad, safe_top + 48), headline, font("Black", 78), INK, W - pad * 2, 1.0)
        y = text_block(d, (pad, y + 10), sub, font("Medium", 32), (90, 90, 90), W - pad * 2, 1.25) + 30
        cta_h = 84
        area_h = H - safe_bot - cta_h - 40 - y
        gap = 24
        cw = (W - pad * 2 - gap) // 2
        ch = area_h
        b = cover(M / before, cw, ch, 0.4)
        a = cover(M / after, cw, ch, 0.35) if not after_framed else None
        im.paste(b, (pad, y))
        if after_framed:
            card = Image.new("RGB", (cw, ch), (233, 233, 231))
            art = contain(M / after, cw - 60, ch - 60)
            card.paste(art, ((cw - art.width) // 2, (ch - art.height) // 2))
            im.paste(card, (pad + cw + gap, y))
        else:
            im.paste(a, (pad + cw + gap, y))
        lf = font("Bold", 26)
        for i, label in enumerate(["TU FOTO", "TU OBRA"]):
            lx = pad + i * (cw + gap) + 20
            pill(d, (lx, y + 20), label, lf, bg=INK if i == 0 else RED, pad=(20, 12))
        # flecha central
        cx, cy = pad + cw + gap // 2, y + ch // 2
        d.ellipse((cx - 38, cy - 38, cx + 38, cy + 38), fill=INK)
        d.text((cx - 17, cy - 26), "→", font=font("Bold", 44), fill=WHITE)
        by = y + ch + 30
        pill(d, (pad, by), cta, font("Bold", 34))
        logo(d, (W - pad - 150, by + 18), fill=INK)
        save(im, f"{cid}-{fmt}.jpg")


def grid_ad(cid, photos, kicker, headline, sub, cta):
    """Cuadrícula de obras en estancia: «elige la tuya»."""
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), INK + (255,))
        d = ImageDraw.Draw(im)
        pad = 56
        safe_top = 60 if fmt == "4x5" else round(H * 0.13)
        safe_bot = 56 if fmt == "4x5" else round(H * 0.20)
        eyebrow(d, (pad, safe_top), kicker)
        y = text_block(d, (pad, safe_top + 48), headline, font("Black", 80), WHITE, W - pad * 2, 1.0)
        y = text_block(d, (pad, y + 8), sub, font("Medium", 32), (190, 190, 190), W - pad * 2, 1.25) + 28
        cols, rows = 3, 2
        gap = 12
        area_h = H - safe_bot - 84 - 36 - y
        cw = (W - pad * 2 - gap * (cols - 1)) // cols
        ch = (area_h - gap * (rows - 1)) // rows
        for i, p in enumerate(photos[: cols * rows]):
            tile = cover(M / p, cw, ch, 0.22)
            im.paste(tile, (pad + (i % cols) * (cw + gap), y + (i // cols) * (ch + gap)))
        by = y + rows * ch + gap + 24
        pill(d, (pad, by), cta, font("Bold", 34))
        logo(d, (W - pad - 150, by + 18))
        save(im, f"{cid}-{fmt}.jpg")


def finishes_ad(cid, slug, kicker, headline, specs, cta):
    """Una obra en sus acabados: calidad y elección."""
    variants = [("none", "Sin marco"), ("white", "Marco blanco"), ("wood", "Marco madera")]
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), PAPER + (255,))
        d = ImageDraw.Draw(im)
        pad = 60
        safe_top = 60 if fmt == "4x5" else round(H * 0.13)
        safe_bot = 56 if fmt == "4x5" else round(H * 0.20)
        eyebrow(d, (pad, safe_top), kicker)
        y = text_block(d, (pad, safe_top + 48), headline, font("Black", 80), INK, W - pad * 2, 1.0) + 26
        spec_h = 50
        area_h = H - safe_bot - 84 - 40 - spec_h - 20 - y
        gap = 14
        cw = (W - pad * 2 - gap * 2) // 3
        for i, (v, label) in enumerate(variants):
            tile = cover(M / "rooms" / f"{slug}-dormitorio-{v}.jpg", cw, area_h, 0.15)
            x = pad + i * (cw + gap)
            im.paste(tile, (x, y))
            pill(d, (x + 14, y + area_h - 62), label, font("SemiBold", 24), bg=WHITE, fg=INK, pad=(16, 12))
        sy = y + area_h + 22
        d.text((pad, sy), specs, font=font("Medium", 28), fill=(80, 80, 80))
        by = sy + spec_h + 18
        pill(d, (pad, by), cta, font("Bold", 34))
        logo(d, (W - pad - 150, by + 18), fill=INK)
        save(im, f"{cid}-{fmt}.jpg")


def offer_ad(cid, photo, kicker, big, line2, sub, cta):
    """Fondo negro, titular gigante y la obra: para campañas de temporada."""
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), INK + (255,))
        d = ImageDraw.Draw(im)
        pad = 64
        safe_top = 64 if fmt == "4x5" else round(H * 0.14)
        safe_bot = 60 if fmt == "4x5" else round(H * 0.20)
        eyebrow(d, (pad, safe_top), kicker)
        y = text_block(d, (pad, safe_top + 50), big, font("Black", 128), WHITE, W - pad * 2, 0.95)
        y = text_block(d, (pad, y + 4), line2, font("Black", 64), RED, W - pad * 2, 1.0)
        y = text_block(d, (pad, y + 14), sub, font("Medium", 32), (190, 190, 190), W - pad * 2, 1.3) + 30
        area_h = H - safe_bot - 84 - 40 - y
        art = cover(M / photo, W - pad * 2, area_h, 0.3)
        im.paste(art, (pad, y))
        by = y + area_h + 30
        pill(d, (pad, by), cta, font("Bold", 34))
        logo(d, (W - pad - 150, by + 18))
        save(im, f"{cid}-{fmt}.jpg")


# ---------- Creativos ----------
# Cada uno es un CONCEPTO distinto (otro motivo de compra, otra persona, otro formato).
# Con Andromeda, 10 conceptos distintos valen más que 30 variaciones del mismo.

before_after(
    "c01-mascota-tu-foto-tu-obra",
    "estilos/ejemplo-retrato-nombre-foto.jpg", "estilos/ejemplo-retrato-nombre-lina.jpg",
    "Retrato de tu mascota", "Tu perro.\nEn tu pared.",
    "Sube una foto y mira la ilustración antes de pagar.", "Pruébalo con tu foto",
)
before_after(
    "c02-familia-regalo",
    "estilos/ejemplo-acuarela-familia-foto.jpg", "estilos/ejemplo-acuarela-familia.jpg",
    "El regalo de este año", "Ese momento,\npara siempre.",
    "Convierte vuestra foto favorita en una acuarela lista para colgar.", "Crear mi acuarela",
)
room_ad(
    "c03-motor-ferrari", "products/ferrari-salon.jpg",
    "Colección Motor", "Hay quien\ncolecciona coches.",
    "Y hay quien los cuelga. Pósters de motor en edición ARSNOIR.", "Ver colección Motor", focus=0.35,
)
room_ad(
    "c04-mentalidad-obsesion", "rooms/obsesion-estudio-none.jpg",
    "Colección Mentalidad", "Lo primero\nque ves\ncada mañana.",
    "Haz que cuente.", "Ver obras", focus=0.3,
)
grid_ad(
    "c05-pared-vacia",
    ["rooms/panter-salon-white.jpg", "rooms/tigre-dormitorio-wood.jpg", "products/ferrari-salon.jpg",
     "rooms/koi-salon-white.jpg", "rooms/rise-to-the-top-salon-white.jpg", "rooms/doberman-rose-dormitorio-none.jpg"],
    "¿Pared vacía?", "Elige la tuya.",
    "Arte original, solo en ARSNOIR. Desde 24,95 €.", "Ver todas las obras",
)
finishes_ad(
    "c06-acabados-panter", "panter",
    "Calidad de galería", "Tú eliges\nel acabado.",
    "Papel mate 200 g · giclée 12 tintas · listo para colgar", "Elegir mi acabado",
)
room_ad(
    "c07-animales-tigre", "rooms/tigre-dormitorio-wood.jpg",
    "Colección Animales", "Tu dormitorio\nmerece algo\nsalvaje.",
    None, "Ver Animales", focus=0.15,
)
styles_ad(
    "c08-mascota-estilos",
    [("cards/pz-card-oleo-vintage.jpg", "Óleo vintage"), ("cards/pz-card-retrato-con-sudadera.jpg", "Con sudadera"),
     ("cards/pz-card-en-su-rincon.jpg", "En su rincón"), ("cards/pz-card-ilustracion-plana.jpg", "Ilustración plana"),
     ("cards/pz-card-retrato-con-nombre.jpg", "Con su nombre"), ("cards/pz-card-acuarela-en-casa.jpg", "Acuarela en casa")],
    "Una foto, seis estilos", "¿Cuál es\nmás él?",
    "Sube su foto y pruébala en todos los estilos antes de pagar.", "Probar los estilos",
)
offer_ad(
    "c09-navidad-regalo-a4", "rooms/koi-salon-white.jpg",
    "Navidad ARSNOIR", "Regalo\ndoble.", "Desde 120 €, un A4 gratis.",
    "Tú eliges la obra de regalo en el carrito.", "Elegir mis obras",
)
room_ad(
    "c10-asi-llega", "feat/arsnoir-bienvenida.jpg",
    "Impreso bajo pedido", "Abrir la caja.\nColgarla.\nListo.",
    "Con marco y listo para colgar. Llega en 4–10 días.", "Comprar ahora", focus=0.2,
)


def hero_ad(cid, photo, kicker, line1, line2, cta, tag):
    """Foto propia a sangre (generada en Higgsfield): titular arriba en la pared, botón abajo sobre el suelo."""
    src = Image.open(M / photo).convert("RGB")
    wall = src.getpixel((src.width // 2, 40))
    floor = src.getpixel((src.width // 2, src.height - 10))
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), wall + (255,))
        ph = round(src.height * W / src.width)
        photo_y = 0 if fmt == "4x5" else 250
        im.paste(src.resize((W, ph), Image.LANCZOS), (0, photo_y))
        if fmt == "9x16":
            # funde la foto con el color de la pared (arriba) y del suelo (abajo)
            fade = 140
            top = Image.new("RGBA", (W, fade), wall + (255,))
            top.putalpha(Image.linear_gradient("L").rotate(180).resize((W, fade)))
            im.alpha_composite(top, (0, photo_y))
            below = Image.new("RGBA", (W, H - (photo_y + ph) + fade), floor + (255,))
            mask = Image.linear_gradient("L").resize((W, fade))
            full = Image.new("L", below.size, 255)
            full.paste(mask, (0, 0))
            below.putalpha(full)
            im.alpha_composite(below, (0, photo_y + ph - fade))
        im.alpha_composite(gradient(W, 330 + photo_y, 170, 0), (0, 0))
        im.alpha_composite(gradient(W, 360, 0, 210), (0, H - 360 - (0 if fmt == "4x5" else 330)))
        if fmt == "9x16":
            im.alpha_composite(Image.new("RGBA", (W, 330), INK + (210,)), (0, H - 330))
        d = ImageDraw.Draw(im)
        pad = 64
        y0 = 40 if fmt == "4x5" else 272
        size = 64 if fmt == "4x5" else 74
        pill(d, (pad, y0), kicker.upper(), font("SemiBold", 22), pad=(16, 9))
        y = y0 + 52
        d.text((pad, y), line1, font=font("Black", size), fill=WHITE)
        d.text((pad, y + round(size * 1.02)), line2, font=font("Black", size), fill=RED)
        cta_y = H - 64 - 84 if fmt == "4x5" else round(H * 0.80) - 84
        d.text((pad, cta_y - 46), tag, font=font("Medium", 30), fill=(230, 230, 230))
        pill(d, (pad, cta_y), cta, font("Bold", 34))
        logo(d, (W - pad - 150, cta_y + 18))
        save(im, f"{cid}-{fmt}.jpg")



def grotesk(size, weight):
    """Space Grotesk del tema (assets/space-grotesk-latin.woff2), la tipografía de la web."""
    import io
    from fontTools.ttLib import TTFont
    tt = TTFont(str(ROOT / "assets" / "space-grotesk-latin.woff2"))
    tt.flavor = None
    buf = io.BytesIO()
    tt.save(buf)
    buf.seek(0)
    f = ImageFont.truetype(buf, size)
    f.set_variation_by_axes([weight])
    return f


def spaced(draw, cx, y, text, f, fill, tracking):
    """Texto centrado con espaciado entre letras (como el logotipo de los reels)."""
    widths = [draw.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=f, fill=fill)
        x += w + tracking
    return total


def scene_canvas(src, W, H, photo_y):
    """La foto a ancho completo en un lienzo W×H; lo que sobra arriba y abajo se rellena con el color de la pared y del suelo, fundido."""
    wall = src.getpixel((src.width // 2, 40))
    floor = src.getpixel((src.width // 2, src.height - 10))
    im = Image.new("RGBA", (W, H), wall + (255,))
    ph = round(src.height * W / src.width)
    im.paste(src.resize((W, ph), Image.LANCZOS), (0, photo_y))
    fade = round(W * 0.15)
    if photo_y > 0:
        top = Image.new("RGBA", (W, fade), wall + (255,))
        top.putalpha(Image.linear_gradient("L").rotate(180).resize((W, fade)))
        im.alpha_composite(top, (0, photo_y))
    if photo_y + ph < H:
        below = Image.new("RGBA", (W, H - (photo_y + ph) + fade), floor + (255,))
        mask = Image.new("L", below.size, 255)
        mask.paste(Image.linear_gradient("L").resize((W, fade)), (0, 0))
        below.putalpha(mask)
        im.alpha_composite(below, (0, photo_y + ph - fade))
    return im


def centered(draw, cx, y, text, f, fill):
    draw.text((cx - draw.textlength(text, font=f) / 2, y), text, font=f, fill=fill)


def wordmark(draw, cx, y, size=34, fill=WHITE):
    spaced(draw, cx, y, "ARSNOIR", grotesk(size, 600), fill, round(size * 0.36))


def editorial_ad(cid, photo, lines, price=None):
    """Foto a sangre, titular grande en Space Grotesk arriba y solo el logotipo ARSNOIR abajo.
    Sin botón dibujado: el botón lo pone Meta debajo del anuncio."""
    src = Image.open(M / photo).convert("RGB")
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        photo_y = 130 if fmt == "4x5" else 330
        im = scene_canvas(src, W, H, photo_y)
        im.alpha_composite(gradient(W, 260 + photo_y, 120, 0), (0, 0))
        bot = 260 if fmt == "4x5" else 560
        im.alpha_composite(gradient(W, bot, 0, 170), (0, H - bot))
        d = ImageDraw.Draw(im)
        cx = W / 2
        size = 86 if fmt == "4x5" else 92
        f = grotesk(size, 700)
        y = 46 if fmt == "4x5" else 300
        for line in lines:
            centered(d, cx, y, line, f, WHITE)
            y += round(size * 1.04)
        if price:
            y += 18
            centered(d, cx, y, price, grotesk(34, 400), (230, 230, 230))
        base = H - 96 if fmt == "4x5" else round(H * 0.80) - 40
        wordmark(d, cx, base)
        save(im, f"{cid}-{fmt}.jpg")


def ease(t):
    return t * t * (3 - 2 * t)


def reel_pullout(cid, photo, focus, beats, seconds=9, fps=30):
    """Reel 9:16: arranca en primer plano de `focus` (x, y en la foto, 0–1) y se abre hasta la habitación entera.
    `beats` = [(desde_s, hasta_s, [(texto, tamaño, peso, color)…])]. Termina con el logotipo. Sin audio: pon un sonido en tendencia al publicarlo."""
    import subprocess
    src = Image.open(M / photo).convert("RGB")
    W, H = 1080, 1920
    S = 1.6  # el lienzo se trabaja a 1,6× para que el zoom no pierda nitidez
    CW, CH = round(W * S), round(H * S)
    photo_y = round(330 * S)
    base = scene_canvas(src, CW, CH, photo_y).convert("RGB")
    fx = focus[0] * CW
    fy = photo_y + focus[1] * round(src.height * CW / src.width)
    zoom0 = 2.2
    out = OUT / f"{cid}-9x16.mp4"
    ff = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps),
         "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", str(out)],
        stdin=subprocess.PIPE,
    )
    shade = gradient(W, 820, 150, 0)
    shade_bot = gradient(W, 560, 0, 170)
    total = seconds * fps
    for i in range(total):
        t = i / fps
        k = ease(min(1.0, t / 6.0))
        z = zoom0 + (1.0 - zoom0) * k
        cw, ch = CW / z, CH / z
        cx = fx + (CW / 2 - fx) * k
        cy = fy + (CH / 2 - fy) * k
        cx = min(max(cx, cw / 2), CW - cw / 2)
        cy = min(max(cy, ch / 2), CH - ch / 2)
        frame = base.crop((round(cx - cw / 2), round(cy - ch / 2), round(cx + cw / 2), round(cy + ch / 2))).resize((W, H), Image.LANCZOS).convert("RGBA")
        frame.alpha_composite(shade, (0, 0))
        frame.alpha_composite(shade_bot, (0, H - 560))
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        for start, end, lines in beats:
            if start <= t < end:
                a = min(1.0, (t - start) / 0.25, (end - t) / 0.25 if end < seconds else 1.0)
                y = 300
                for text, size, weight, color in lines:
                    rise = round((1 - a) * 24)
                    centered(d, W / 2, y + rise, text, grotesk(size, weight), color + (round(255 * a),))
                    y += round(size * 1.08)
        if t >= 6.4:
            a = min(1.0, (t - 6.4) / 0.4)
            spaced(d, W / 2, round(H * 0.80) - 40, "ARSNOIR", grotesk(40, 600), WHITE + (round(255 * a),), 15)
        sh = layer.split()[3].filter(ImageFilter.GaussianBlur(14)).point(lambda v: min(255, v * 1.6))
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        shadow.putalpha(sh)
        frame.alpha_composite(shadow)
        frame.alpha_composite(layer)
        ff.stdin.write(frame.convert("RGB").tobytes())
    ff.stdin.close()
    ff.wait()
    print("✓", out.name)


PAIR = "ads/src/pareja-motor-revuelto-ataca.jpg"
editorial_ad("c11-pareja-motor", PAIR, ["Hay quien los aparca.", "Tú los cuelgas."], price="Desde 24,95 €")
editorial_ad("c12-pareja-motor-manifiesto", PAIR, ["No decores", "tu espacio."], price="Cambia cómo se siente · Desde 24,95 €")


def depth_ad(cid, photo, frames, big, line, labels, price):
    """Titular gigante que pasa POR DETRÁS de los cuadros (efecto portada de revista), cartelas de galería
    bajo cada obra y la información pequeña abajo. `frames` = cajas de los marcos en píxeles de la foto original."""
    src = Image.open(M / photo).convert("RGB")
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        photo_y = 0 if fmt == "4x5" else 330
        k = W / src.width
        im = scene_canvas(src, W, H, photo_y)
        bot = 330 if fmt == "4x5" else 620
        im.alpha_composite(gradient(W, bot, 0, 200), (0, H - bot - (0 if fmt == "4x5" else 0)))
        boxes = [(round(x0 * k), round(y0 * k) + photo_y, round(x1 * k), round(y1 * k) + photo_y) for x0, y0, x1, y1 in frames]
        top_frame = min(b[1] for b in boxes)
        # titular gigante, ajustado al ancho, con su parte baja escondida detrás de los marcos
        size = 300
        while True:
            f = grotesk(size, 700)
            tw = ImageDraw.Draw(im).textlength(big, font=f)
            if tw <= W - 70:
                break
            size -= 4
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        asc = f.getbbox(big)[3]
        ty = top_frame - round(asc * 0.84)
        d.text(((W - tw) / 2, ty), big, font=f, fill=WHITE + (245,))
        hole = Image.new("L", (W, H), 255)
        hd = ImageDraw.Draw(hole)
        for b in boxes:
            hd.rectangle(b, fill=0)
        layer.putalpha(Image.composite(layer.split()[3], Image.new("L", (W, H), 0), hole))
        im.alpha_composite(layer)
        d = ImageDraw.Draw(im)
        # cartelas de galería bajo cada obra
        lf, sf = grotesk(20, 600), grotesk(17, 400)
        for b, (name, spec) in zip(boxes, labels):
            cx = (b[0] + b[2]) / 2
            spaced(d, cx, b[3] + 16, name.upper(), lf, WHITE, 5)
            spaced(d, cx, b[3] + 44, spec, sf, (220, 220, 220), 2)
        # información abajo
        cx = W / 2
        base = H - 70 if fmt == "4x5" else round(H * 0.80) - 10
        wordmark(d, cx, base - 6, size=30)
        centered(d, cx, base - 64, price, grotesk(30, 400), (235, 235, 235))
        centered(d, cx, base - 130, line, grotesk(50, 700), WHITE)
        save(im, f"{cid}-{fmt}.jpg")


depth_ad(
    "c14-pareja-motor-portada", PAIR,
    frames=[(274, 351, 772, 1061), (843, 351, 1343, 1061)],
    big="NO DECORES.", line="Cambia cómo se siente.",
    labels=[("Revuelto", "50 × 70 cm"), ("Ataca", "50 × 70 cm")],
    price="Desde 24,95 €",
)


def clean_ad(cid, photo):
    """La foto tal cual, sin texto: parece una publicación normal. Precio y oferta van en el texto del anuncio."""
    src = Image.open(M / photo).convert("RGB")
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = scene_canvas(src, W, H, 0 if fmt == "4x5" else 300)
        save(im, f"{cid}-{fmt}.jpg")


def shop_tags_ad(cid, photo, frames, tags):
    """Etiquetas de producto tipo Instagram Shopping bajo cada obra: nombre + precio. Nada más."""
    src = Image.open(M / photo).convert("RGB")
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        photo_y = 0 if fmt == "4x5" else 300
        k = W / src.width
        im = scene_canvas(src, W, H, photo_y)
        d = ImageDraw.Draw(im)
        nf, pf = grotesk(30, 700), grotesk(25, 400)
        for (x0, y0, x1, y1), (name, price) in zip(frames, tags):
            cx = (x0 + x1) / 2 * k
            top = y1 * k + photo_y + 22
            tw = max(d.textlength(name, font=nf), d.textlength(price, font=pf)) + 40 + 26
            th = 92
            bx = cx - tw / 2
            d.polygon([(cx - 12, top), (cx + 12, top), (cx, top - 12)], fill=WHITE)
            d.rounded_rectangle((bx, top, bx + tw, top + th), radius=14, fill=WHITE)
            d.text((bx + 20, top + 14), name, font=nf, fill=INK)
            d.text((bx + 20, top + 52), price, font=pf, fill=(90, 90, 90))
            d.text((bx + tw - 36, top + 24), "›", font=grotesk(40, 500), fill=INK)
        save(im, f"{cid}-{fmt}.jpg")


clean_ad("c15-pareja-motor-limpia", PAIR)
shop_tags_ad(
    "c16-pareja-motor-etiquetas", PAIR,
    frames=[(274, 351, 772, 1061), (843, 351, 1343, 1061)],
    tags=[("Revuelto", "Desde 24,95 €"), ("Ataca", "Desde 24,95 €")],
)


def wall_scene(src, W, H, photo_h, photo_y, center_x):
    """La foto escalada a `photo_h` de alto, encuadrada en `center_x` (0–1). Si sobra lienzo arriba,
    se rellena con la propia pared de la foto en espejo (sin colores planos ni cortes)."""
    k = photo_h / src.height
    pw = round(src.width * k)
    ph = round(photo_h)
    big = src.resize((pw, ph), Image.LANCZOS)
    x0 = min(max(round(center_x * pw - W / 2), 0), pw - W)
    big = big.crop((x0, 0, x0 + W, ph))
    im = Image.new("RGB", (W, H))
    if photo_y > 0:
        strip = big.crop((0, 0, W, photo_y)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(6))
        im.paste(strip, (0, 0))
    im.paste(big, (0, photo_y))
    return im.convert("RGBA")


def brand_button_ad(cid, photo, lines, button, note=None, price=None):
    """Logotipo ARSNOIR en blanco y la frase arriba, sobre la pared de la foto; el botón solo, abajo."""
    src = Image.open(M / photo).convert("RGB")
    logo_src = Image.open(M / "ads/src/logo-arsnoir-blanco.png")
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        if fmt == "4x5":
            im = wall_scene(src, W, H, H, 0, 0.5)
            lw, ly, size, gap = 290, 28, 44, 18
        else:
            im = wall_scene(src, W, H, H - 260, 260, 0.502)
            lw, ly, size, gap = 340, 296, 56, 30
        bot = 300 if fmt == "4x5" else 560
        im.alpha_composite(gradient(W, bot, 0, 190), (0, H - bot))
        logo = logo_src.resize((lw, round(logo_src.height * lw / logo_src.width)), Image.LANCZOS)
        im.alpha_composite(logo, ((W - lw) // 2, ly))
        d = ImageDraw.Draw(im)
        cx = W / 2
        f = grotesk(size, 600)
        y = ly + logo.height + gap
        for line in lines:
            centered(d, cx, y, line, f, WHITE)
            y += round(size * 1.12)
        def soft_text(y, text, tf, fill=WHITE):
            sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            centered(ImageDraw.Draw(sh), cx, y, text, tf, (0, 0, 0, 230))
            im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
            centered(ImageDraw.Draw(im), cx, y, text, tf, fill)

        bf = grotesk(36, 700)
        bw, bh = d.textlength(button, font=bf) + 130, 94
        by = H - (104 if note else 64) - bh if fmt == "4x5" else round(H * 0.80) - bh - (40 if note else 0)
        if price:
            pf = grotesk(46 if fmt == "4x5" else 52, 700)
            soft_text(by - pf.size - 22, price, pf)
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((cx - bw / 2, by, cx + bw / 2, by + bh), radius=bh / 2, fill=WHITE)
        centered(d, cx, by + (bh - 36) / 2 - 4, button, bf, INK)
        if note:
            soft_text(by + bh + 16, note, grotesk(26 if fmt == "4x5" else 30, 600))
        save(im, f"{cid}-{fmt}.jpg")


brand_button_ad(
    "c17-pareja-motor-boton", PAIR,
    ["No decores tu espacio.", "Cambia cómo se siente."], "Ver la pareja",
    price="Desde 24,95 €", note="Impresión en Europa",
)

brand_button_ad(
    "c18-pareja-motor-pack", PAIR,
    ["No decores tu espacio.", "Cambia cómo se siente."], "2 obras −15 % · hasta el 9 nov",
    price="Desde 24,95 €", note="Con o sin marco de pino · Plexiglás irrompible",
)
brand_button_ad(
    "c19-pareja-motor-bienvenida", PAIR,
    ["No decores tu espacio.", "Cambia cómo se siente."], "−10 % en tu primer pedido",
    price="Desde 24,95 €", note="Con o sin marco de pino · Plexiglás irrompible",
)


def unboxing_ad(cid, photo, headline, price, button, note, x9=0.5, fit9_y=None):
    """Foto cenital de unboxing: logotipo y titular arriba sobre degradado oscuro; precio, botón y nota abajo.
    En 9:16 la foto llena la pantalla, recortada en horizontal en `x9` (0–1)."""
    src = Image.open(M / photo).convert("RGB")
    logo_src = Image.open(M / "ads/src/logo-arsnoir-blanco.png")
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        if fmt == "9x16" and fit9_y is not None:
            # foto entera a lo ancho; arriba el techo y abajo el suelo de la propia foto, estirados y fundidos sin corte
            py, fade = fit9_y, 140
            ph = round(src.height * W / src.width)
            body = src.resize((W, ph), Image.LANCZOS)
            base = Image.new("RGB", (W, H))
            base.paste(body.crop((0, 0, W, 120)).resize((W, py + fade), Image.BICUBIC).filter(ImageFilter.GaussianBlur(16)), (0, 0))
            rest = H - py - ph
            base.paste(body.crop((0, ph - 40, W, ph)).resize((W, rest + fade), Image.BICUBIC).filter(ImageFilter.GaussianBlur(14)), (0, py + ph - fade))
            mask = Image.new("L", (W, ph), 255)
            mask.paste(Image.linear_gradient("L").resize((W, fade)), (0, 0))
            mask.paste(Image.linear_gradient("L").rotate(180).resize((W, fade)), (0, ph - fade))
            base.paste(body, (0, py), mask)
            im = base.convert("RGBA")
        else:
            k = max(W / src.width, H / src.height)
            big = src.resize((round(src.width * k), round(src.height * k)), Image.LANCZOS)
            x0 = round((big.width - W) * (0.5 if fmt == "4x5" else x9))
            y0 = (big.height - H) // 2
            im = big.crop((x0, y0, x0 + W, y0 + H)).convert("RGBA")
        top_h, bot_h = (430, 470) if fmt == "4x5" else (700, 800)
        im.alpha_composite(gradient(W, top_h, 215, 0), (0, 0))
        im.alpha_composite(gradient(W, bot_h, 0, 230), (0, H - bot_h))
        d = ImageDraw.Draw(im)
        cx = W / 2
        lw = 290 if fmt == "4x5" else 330
        logo = logo_src.resize((lw, round(logo_src.height * lw / logo_src.width)), Image.LANCZOS)
        ly = 44 if fmt == "4x5" else 292
        im.alpha_composite(logo, ((W - lw) // 2, ly))
        d = ImageDraw.Draw(im)
        lines = headline.split("\n")
        hs = (64 if fmt == "4x5" else 72) if len(lines) == 1 else (52 if fmt == "4x5" else 62)
        hf = grotesk(hs, 700)
        hy = ly + logo.height + 22
        for line in lines:
            centered(d, cx, hy, line, hf, WHITE)
            hy += round(hs * 1.1)
        bf = grotesk(36, 700)
        bw, bh = d.textlength(button, font=bf) + 130, 94
        by = H - 104 - bh if fmt == "4x5" else round(H * 0.80) - bh - 40
        pf = grotesk(48 if fmt == "4x5" else 54, 700)
        centered(d, cx, by - pf.size - 22, price, pf, WHITE)
        d.rounded_rectangle((cx - bw / 2, by, cx + bw / 2, by + bh), radius=bh / 2, fill=WHITE)
        centered(d, cx, by + (bh - 36) / 2 - 4, button, bf, INK)
        centered(d, cx, by + bh + 16, note, grotesk(26 if fmt == "4x5" else 30, 600), (235, 235, 235))
        save(im, f"{cid}-{fmt}.jpg")


unboxing_ad(
    "c20-unboxing-dos-obras", "ads/src/unboxing-tigre-petardeo.jpg",
    "Dos obras. Un 15 % menos.", "Desde 24,95 €", "Elegir mis dos obras",
    "Solo hasta el 9 de noviembre", x9=0.55,
)


def pet_light_ad(cid, photo, headline, price, button, note):
    """Mascota sobre fondo claro: logotipo y texto en negro arriba, sobre un velo crema suave; botón negro.
    4:5: logo, titular y precio arriba; botón y nota abajo, en el suelo, sin tapar al perro.
    9:16: la foto a lo ancho, con la propia foto en espejo arriba y abajo; todo el texto arriba (abajo lo tapa Instagram)."""
    src = Image.open(M / photo).convert("RGB")
    logo_src = Image.open(M / "ads/src/logo-arsnoir-negro.png")
    CREAM = (246, 241, 234)

    def veil(W, h, a0, a1, top=True):
        layer = Image.new("RGBA", (W, h), CREAM + (0,))
        g = Image.linear_gradient("L").resize((W, h))
        if top:
            g = g.rotate(180)
        layer.putalpha(g.point(lambda v: round(a1 + (a0 - a1) * v / 255)))
        return layer

    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        ph = round(src.height * W / src.width)
        if fmt == "4x5":
            im = cover(M / photo, W, H, 0.5).convert("RGBA")
            im.alpha_composite(veil(W, 330, 215, 0), (0, 0))
            im.alpha_composite(veil(W, 190, 190, 0, top=False), (0, H - 190))
        else:
            py = 300
            fade = 140
            body = src.resize((W, ph), Image.LANCZOS)
            im = Image.new("RGB", (W, H))
            # arriba: la propia foto en espejo; abajo: el suelo estirado. Ambos desenfocados.
            top = body.crop((0, 0, W, py + fade)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(12))
            im.paste(top, (0, 0))
            rest = H - py - ph
            floor = body.crop((0, ph - 40, W, ph)).resize((W, rest + fade), Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))
            im.paste(floor, (0, py + ph - fade))
            # la foto se funde arriba y abajo con el relleno, sin corte visible
            mask = Image.new("L", (W, ph), 255)
            mask.paste(Image.linear_gradient("L").resize((W, fade)), (0, 0))
            mask.paste(Image.linear_gradient("L").rotate(180).resize((W, fade)), (0, ph - fade))
            im.paste(body, (0, py), mask)
            im = im.convert("RGBA")
            im.alpha_composite(veil(W, 700, 225, 0), (0, 0))
        d = ImageDraw.Draw(im)
        cx = W / 2
        lw = 270 if fmt == "4x5" else 310
        logo = logo_src.resize((lw, round(logo_src.height * lw / logo_src.width)), Image.LANCZOS)
        ly = 34 if fmt == "4x5" else 290
        im.alpha_composite(logo, ((W - lw) // 2, ly))
        d = ImageDraw.Draw(im)
        hs = 62 if fmt == "4x5" else 70
        y = ly + logo.height + 14
        centered(d, cx, y, headline, grotesk(hs, 700), INK)
        y += hs + 12
        ps = 40 if fmt == "4x5" else 46
        centered(d, cx, y, price, grotesk(ps, 600), INK)
        y += ps + 22
        bf = grotesk(34 if fmt == "4x5" else 36, 700)
        bw, bh = d.textlength(button, font=bf) + 120, 88 if fmt == "4x5" else 94
        nf = grotesk(24 if fmt == "4x5" else 28, 600)
        if fmt == "4x5":
            by = H - 52 - 30 - bh
        else:
            by = y
        d.rounded_rectangle((cx - bw / 2, by, cx + bw / 2, by + bh), radius=bh / 2, fill=INK)
        centered(d, cx, by + (bh - bf.size) / 2 - 4, button, bf, WHITE)
        centered(d, cx, by + bh + 12, note, nf, INK)
        save(im, f"{cid}-{fmt}.jpg")


pet_light_ad(
    "c21-mascota-thor", "ads/src/mascota-thor-glam-comic.jpg",
    "¿Cuál es más él?", "Desde 24,95 €", "Pruébalo con su foto",
    "Vista previa gratis antes de pagar",
)

unboxing_ad(
    "c22-mascota-berner", "ads/src/mascota-berner-pop-glam.jpg",
    "Él en el sofá.\nSu retrato en la pared.", "Desde 24,95 €", "Pruébalo con su foto",
    "Vista previa gratis antes de pagar", fit9_y=290,
)

if __name__ == "__main__":
    import sys
    if "--video" in sys.argv:
        reel_pullout(
            "c13-reel-pareja-motor", PAIR, focus=(0.615, 0.40),
            beats=[
                (0.0, 2.3, [("No decores", 110, 700, WHITE), ("tu espacio.", 110, 700, WHITE)]),
                (2.3, 4.6, [("Cambia cómo", 110, 700, WHITE), ("se siente.", 110, 700, WHITE)]),
                (4.6, 9.0, [("Revuelto + Ataca", 64, 600, WHITE), ("Desde 24,95 €", 44, 400, (230, 230, 230))]),
            ],
        )
