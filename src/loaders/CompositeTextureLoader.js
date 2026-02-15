import { CanvasTexture, Loader, SRGBColorSpace, TextureLoader } from "three";

/**
 * Loader que compone cara_n.jpg con test_n.png encima.
 * Para URLs como /textures/cara_1.jpg carga cara_1.jpg + test_1.png y los superpone.
 */
class CompositeTextureLoader extends Loader {
  constructor(manager) {
    super(manager);
    this.textureLoader = new TextureLoader(manager);
  }

  setPath(path) {
    super.setPath(path);
    this.textureLoader.setPath(path);
    return this;
  }

  load(url, onLoad, onProgress, onError) {
    const match = url.match(/cara_(\d+)(\.jpg)?$/);
    if (!match) {
      return this.textureLoader.load(url, onLoad, onProgress, onError);
    }

    const num = match[1];
    const baseUrl = url.replace(/\/[^/]+$/, `/cara_${num}.jpg`);
    const overlayUrl = url.replace(/\/[^/]+$/, `/test_${num}.png`);

    this._loadImage(baseUrl)
      .then((baseImg) =>
        this._loadImage(overlayUrl).then((overlayImg) => ({
          baseImg,
          overlayImg,
        }))
      )
      .then(({ baseImg, overlayImg }) => {
        const canvas = document.createElement("canvas");
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImg, 0, 0);
        ctx.drawImage(
          overlayImg,
          0,
          0,
          overlayImg.width,
          overlayImg.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const texture = new CanvasTexture(canvas);
        texture.colorSpace = SRGBColorSpace;
        if (onLoad) onLoad(texture);
      })
      .catch((err) => {
        if (onError) onError(err);
      });
  }

  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = this.crossOrigin || "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
}

export { CompositeTextureLoader };
