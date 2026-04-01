#!/bin/bash

# --- CONFIGURACIÓN ---
TARGET_WIDTH=1365
TARGET_HEIGHT=2048
# 0 = toca los bordes, 5 = un pequeño aire alrededor, 10 = margen notable
MARGIN_PERCENT=11
# ---------------------

# Dependencia: sudo pacman -S imagemagick bc

if [ -z "$1" ]; then
    echo "Uso: $0 imagen_entrada.png"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.*}_fixed.png"

# 1. Calculamos el área útil restando el margen de AMBOS lados (izq+der y arriba+abajo)
# Si MARGIN_PERCENT es 0, SAFE_WIDTH será 1365.
SAFE_WIDTH=$(echo "$TARGET_WIDTH * (100 - (2 * $MARGIN_PERCENT)) / 100" | bc)
SAFE_HEIGHT=$(echo "$TARGET_HEIGHT * (100 - (2 * $MARGIN_PERCENT)) / 100" | bc)

echo "Reescalando $INPUT_FILE a zona de seguridad: ${SAFE_WIDTH}x${SAFE_HEIGHT}..."

# 2. Ejecutamos la transformación
magick "$INPUT_FILE" \
    -resize "${SAFE_WIDTH}x${SAFE_HEIGHT}" \
    -background none \
    -gravity center \
    -extent ${TARGET_WIDTH}x${TARGET_HEIGHT} \
    "$OUTPUT_FILE"

echo "¡Completado! Imagen generada: $OUTPUT_FILE"
