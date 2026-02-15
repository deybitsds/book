import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "cara_1",
  "cara_2",
  "cara_3",
  "cara_4",
  "cara_5",
  "cara_6",
  "cara_7",
  "cara_8",
  "cara_9",
  "cara_10",
  "cara_11",
  "cara_12",
  "cara_13",
  "cara_14",
  "cara_15",
  "cara_16",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return null;
};
