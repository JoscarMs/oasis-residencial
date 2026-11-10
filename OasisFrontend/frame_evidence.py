import os
from PIL import Image, ImageDraw, ImageFont

EVIDENCE_DIR = r"C:\ING-Sistemas\Proyecto OASIS\evidence"

def add_windows_frame(img_path, output_path, url_text, active_tab_title):
    im = Image.open(img_path)
    w, h = im.size # 1280, 800

    # Header height: 75px (tab bar + address bar)
    # Taskbar height: 42px
    top_h = 75
    bot_h = 42
    total_w = w
    total_h = h + top_h + bot_h

    framed = Image.new("RGB", (total_w, total_h), "#ffffff")
    draw = ImageDraw.Draw(framed)

    # 1. Chrome Tab Bar & Titlebar
    draw.rectangle([0, 0, total_w, 36], fill="#e8eaed")
    # Active tab
    draw.rounded_rectangle([75, 6, 280, 36], radius=6, fill="#ffffff")
    draw.text((95, 14), active_tab_title[:24], fill="#202124")
    # Close/Min/Max buttons
    draw.rectangle([total_w - 45, 0, total_w, 36], fill="#e8eaed")
    draw.text((total_w - 30, 10), "✕", fill="#5f6368")
    draw.text((total_w - 65, 10), "□", fill="#5f6368")
    draw.text((total_w - 95, 10), "—", fill="#5f6368")

    # 2. Chrome Address Bar
    draw.rectangle([0, 36, total_w, top_h], fill="#ffffff")
    draw.text((15, 47), "←", fill="#5f6368")
    draw.text((40, 47), "→", fill="#5f6368")
    draw.text((65, 47), "↻", fill="#5f6368")
    
    # URL Omnibox
    draw.rounded_rectangle([90, 41, total_w - 180, 69], radius=14, fill="#f1f3f4")
    draw.text((115, 48), "🔒 " + url_text, fill="#202124")

    # User Profile Avatar in Chrome
    draw.ellipse([total_w - 150, 44, total_w - 124, 70], fill="#0d9488")
    draw.text((total_w - 143, 49), "JM", fill="#ffffff")
    draw.text((total_w - 115, 50), "JOSCAR", fill="#3c4043")

    # Paste UI Content
    framed.paste(im, (0, top_h))

    # 3. Windows 11 Taskbar
    draw.rectangle([0, top_h + h, total_w, total_h], fill="#f3f3f3")
    # Taskbar top border
    draw.line([0, top_h + h, total_w, top_h + h], fill="#e5e5e5", width=1)
    
    # Center icons representation
    cx = total_w // 2 - 80
    # Start button
    draw.rounded_rectangle([cx, top_h + h + 6, cx + 30, top_h + h + 36], radius=4, fill="#0078d4")
    draw.text((cx + 8, top_h + h + 10), "⊞", fill="#ffffff")
    # VS Code / Chrome icons
    draw.rounded_rectangle([cx + 36, top_h + h + 6, cx + 66, top_h + h + 36], radius=4, fill="#007acc")
    draw.text((cx + 45, top_h + h + 10), "C", fill="#ffffff")
    draw.rounded_rectangle([cx + 72, top_h + h + 6, cx + 102, top_h + h + 36], radius=4, fill="#ffffff", outline="#0d9488", width=2)
    draw.text((cx + 81, top_h + h + 10), "🌐", fill="#0d9488")
    draw.rounded_rectangle([cx + 108, top_h + h + 6, cx + 138, top_h + h + 36], radius=4, fill="#1e1e1e")
    draw.text((cx + 116, top_h + h + 10), ">_", fill="#ffffff")

    # System Tray & Clock
    tray_x = total_w - 210
    draw.text((tray_x, top_h + h + 12), "ESP  🔊  📶", fill="#444444")
    # Exact Date & Time
    draw.text((tray_x + 95, top_h + h + 6), "11:15 p. m.", fill="#111827")
    draw.text((tray_x + 95, top_h + h + 22), "27/09/2026", fill="#4b5563")

    framed.save(output_path, "PNG")
    print(f"Framed: {output_path}")

captures = [
    ("01_tipos_list.png", "framed_01_list.png", "http://localhost:4200/alojamiento/tipos-habitacion", "Residencia OASIS - Tipos"),
    ("02_nuevo_form_vacio.png", "framed_02_form_nuevo.png", "http://localhost:4200/alojamiento/tipos-habitacion/nuevo", "OASIS - Nuevo Tipo"),
    ("03_nuevo_form_lleno.png", "framed_03_form_lleno.png", "http://localhost:4200/alojamiento/tipos-habitacion/nuevo", "OASIS - Registro Tipo"),
    ("04_list_con_nuevo_tipo.png", "framed_04_creado_en_lista.png", "http://localhost:4200/alojamiento/tipos-habitacion", "OASIS - Item Creado"),
    ("05_editar_form_cargado.png", "framed_05_form_editar.png", "http://localhost:4200/alojamiento/tipos-habitacion/1/editar", "OASIS - Editar #1"),
    ("06_error_fk_asociada.png", "framed_06_error_fk.png", "http://localhost:4200/alojamiento/tipos-habitacion", "OASIS - Control Error"),
    ("07_avisos_segunda_ruta.png", "framed_07_avisos_nav.png", "http://localhost:4200/comunicacion/avisos", "OASIS - Avisos Comunitarios"),
    ("08_eliminacion_exitosa.png", "framed_08_eliminado.png", "http://localhost:4200/alojamiento/tipos-habitacion", "OASIS - Eliminación Exitosa"),
]

for src, dst, url, tab in captures:
    src_p = os.path.join(EVIDENCE_DIR, src)
    dst_p = os.path.join(EVIDENCE_DIR, dst)
    if os.path.exists(src_p):
        add_windows_frame(src_p, dst_p, url, tab)

print("ALL_FRAMES_DONE")