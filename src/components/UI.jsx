import { atom, useAtom } from "jotai";
import { useEffect } from "react";

// ========== CONFIGURACIÓN MODULAR ==========
// Cambia NUM_PAGES para agregar o quitar páginas.
// Debe ser PAR (las páginas van en parejas: frente y reverso).
//
// Archivos requeridos en public/textures/:
//   - book-cover.jpg, test_cover.png (portada + overlay)
//   - cara_1.jpg ... cara_N.jpg (imagen base de cada página)
//   - test_1.png ... test_N.png (overlay de cada página)
//
// Para agregar páginas, copia archivos existentes:
//   cd public/textures && for i in {17..20}; do cp cara_1.jpg "cara_$i.jpg"; cp test_1.png "test_$i.png"; done
const NUM_PAGES = 16;

if (NUM_PAGES % 2 !== 0) {
  throw new Error(
    `[UI] NUM_PAGES debe ser par (las páginas van en parejas). Valor actual: ${NUM_PAGES}`
  );
}

// Genera automáticamente: cara_1, cara_2, ... cara_N
const pictures = Array.from({ length: NUM_PAGES }, (_, i) => `cara_${i + 1}`);

// Estructura del libro: portada, páginas interiores, contraportada
export const pageAtom = atom(0);
export const pages = [
  { front: "book-cover", back: pictures[0] },
  ...Array.from({ length: (NUM_PAGES - 2) / 2 }, (_, i) => ({
    front: pictures[i * 2 + 1],
    back: pictures[i * 2 + 2],
  })),
  { front: pictures[NUM_PAGES - 1], back: "book-back" },
];

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return null;
};
