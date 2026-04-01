#!/bin/bash

# --- CONFIGURACIÓN ---
TARGET_WIDTH=1365
TARGET_HEIGHT=2048

# Margen en PÍXELES (puedes poner 0 para que toque el borde)
# Esto se restará del tamaño final para forzar la imagen a esa caja
MARGIN_W=10   
MARGIN_H=50  # Por ejemplo, 50px de margen arriba y abajo
# ---------------------

if [ -z "$1" ]; then
    echo "Uso: $0 imagen_entrada.png"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.*}_final.png"

# Calculamos el tamaño exacto que DEBE tener la imagen interna
# Restamos el margen por ambos lados (izq+der o arriba+abajo)
FINAL_W=$(echo "$TARGET_WIDTH - (2 * $MARGIN_W)" | bc)
FINAL_H=$(echo "$TARGET_HEIGHT - (2 * $MARGIN_H)" | bc)

echo "Forzando reescalado a: ${FINAL_W}x${FINAL_H}..."

# El símbolo '!' después de las dimensiones obliga a ImageMagick 
# a ignorar la proporción original y estirar la imagen.
magick "$INPUT_FILE" \
    -resize "${FINAL_W}x${FINAL_H}!" \
    -background none \
    -gravity center \
    -extent ${TARGET_WIDTH}x${TARGET_HEIGHT} \
    "$OUTPUT_FILE"

echo "¡Listo! Imagen procesada: $OUTPUT_FILE"
