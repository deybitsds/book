import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { publicUrl } from "../publicUrl";

// ========== CONFIGURACIÓN MODULAR ==========
// Cambia NUM_PAGES para agregar o quitar páginas.
// Debe ser PAR (las páginas van en parejas: frente y reverso).
//
// Archivos requeridos en public/textures/:
//   - book-cover.jpg, test_cover.png (portada + overlay)
//   - cara_1.jpg ... cara_N.jpg (imagen base de cada página)
//   - test_1.png ... test_N.png (overlay de cada página)
//
// Debe coincidir con el número más alto de cara_N / test_N que tengas (cara_22 → NUM_PAGES = 22).
// Para agregar más: sube los .jpg/.png y aumenta este número (siempre par).
const NUM_PAGES = 22;

if (NUM_PAGES % 2 !== 0) {
  throw new Error(
    `[UI] NUM_PAGES debe ser par (las páginas van en parejas). Valor actual: ${NUM_PAGES}`
  );
}

// Genera automáticamente: cara_1, cara_2, ... cara_N
const pictures = Array.from({ length: NUM_PAGES }, (_, i) => `cara_${i + 1}`);

// Estructura del libro: portada, páginas interiores, contraportada
export const pageAtom = atom(0);

/** Cada clic en Acercar/Alejar incrementa `n`; `dir` es 1 = acercar, -1 = alejar. */
export const zoomPulseAtom = atom({ n: 0, dir: 1 });
export const pages = [
  { front: "book-cover", back: pictures[0] },
  ...Array.from({ length: (NUM_PAGES - 2) / 2 }, (_, i) => ({
    front: pictures[i * 2 + 1],
    back: pictures[i * 2 + 2],
  })),
  { front: pictures[NUM_PAGES - 1], back: "book-back" },
];

export const UI = () => {
  const [page] = useAtom(pageAtom);
  const setZoomPulse = useSetAtom(zoomPulseAtom);

  useEffect(() => {
    const audio = new Audio(publicUrl("/audios/page-flip-01a.mp3"));
    audio.play();
  }, [page]);

  return (
    <div className="zoom-controls" role="group" aria-label="Zoom de la vista">
      <button
        type="button"
        className="zoom-btn"
        onClick={() =>
          setZoomPulse((p) => ({ n: p.n + 1, dir: 1 }))
        }
      >
        Acercar
      </button>
      <button
        type="button"
        className="zoom-btn"
        onClick={() =>
          setZoomPulse((p) => ({ n: p.n + 1, dir: -1 }))
        }
      >
        Alejar
      </button>
    </div>
  );
};
