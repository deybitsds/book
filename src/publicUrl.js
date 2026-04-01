/** Rutas bajo `public/` usando `import.meta.env.BASE_URL` (dev: /, build: ./). */
export function publicUrl(path) {
  const normalized = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${normalized}`;
}
