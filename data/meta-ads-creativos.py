"""Genera los creativos estáticos de Meta Ads a partir de las fotos de media/.

Uso:  python3 data/meta-ads-creativos.py
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


def editorial_ad(cid, photo, lines, caption=None, price=None):
    """Foto a sangre con el texto mínimo de la marca: frase centrada arriba y ARSNOIR abajo.
    Sin botón dibujado: el botón lo pone Meta debajo del anuncio."""
    src = Image.open(M / photo).convert("RGB")
    wall = src.getpixel((src.width // 2, 40))
    floor = src.getpixel((src.width // 2, src.height - 10))
    for fmt, (W, H) in {"4x5": (1080, 1350), "9x16": (1080, 1920)}.items():
        im = Image.new("RGBA", (W, H), wall + (255,))
        ph = round(src.height * W / src.width)
        photo_y = 0 if fmt == "4x5" else 250
        im.paste(src.resize((W, ph), Image.LANCZOS), (0, photo_y))
        if fmt == "9x16":
            fade = 160
            top = Image.new("RGBA", (W, fade), wall + (255,))
            top.putalpha(Image.linear_gradient("L").rotate(180).resize((W, fade)))
            im.alpha_composite(top, (0, photo_y))
            below = Image.new("RGBA", (W, H - (photo_y + ph) + fade), floor + (255,))
            mask = Image.new("L", below.size, 255)
            mask.paste(Image.linear_gradient("L").resize((W, fade)), (0, 0))
            below.putalpha(mask)
            im.alpha_composite(below, (0, photo_y + ph - fade))
        im.alpha_composite(gradient(W, 300 + photo_y, 110, 0), (0, 0))
        im.alpha_composite(gradient(W, 300, 0, 150), (0, H - 300 - (0 if fmt == "4x5" else 380)))
        if fmt == "9x16":
            im.alpha_composite(Image.new("RGBA", (W, 380), INK + (150,)), (0, H - 380))
        d = ImageDraw.Draw(im)
        cx = W / 2
        size = 50 if fmt == "4x5" else 54
        f = grotesk(size, 500)
        y = 62 if fmt == "4x5" else 300
        for line in lines:
            d.text((cx - d.textlength(line, font=f) / 2, y), line, font=f, fill=WHITE)
            y += round(size * 1.18)
        if price:
            pf = grotesk(30 if fmt == "4x5" else 32, 400)
            y += 14
            d.text((cx - d.textlength(price, font=pf) / 2, y), price, font=pf, fill=(225, 225, 225))
        base = H - 118 if fmt == "4x5" else round(H * 0.80) - 70
        w = spaced(d, cx, base, "ARSNOIR", grotesk(34, 600), WHITE, 12)
        d.line((cx - 26, base + 52, cx + 26, base + 52), fill=RED, width=3)
        small = caption or "ARSNOIR.COM"
        spaced(d, cx, base + 66, small.upper(), grotesk(18, 500), (215, 215, 215), 4)
        save(im, f"{cid}-{fmt}.jpg")


editorial_ad(
    "c11-pareja-motor", "ads/src/pareja-motor-revuelto-ataca.jpg",
    ["Hay quien los aparca.", "Tú los cuelgas."], price="Desde 24,95 €",
)
editorial_ad(
    "c12-pareja-motor-manifiesto", "ads/src/pareja-motor-revuelto-ataca.jpg",
    ["No decores tu espacio.", "Cambia cómo se siente."], price="Desde 24,95 €",
)
