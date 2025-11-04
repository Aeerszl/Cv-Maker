declare module 'dom-to-image-more' {
  interface Options {
    quality?: number;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    bgcolor?: string;
    filter?: (node: Node) => boolean;
  }

  const domtoimage: {
    toPng: (node: Node, options?: Options) => Promise<string>;
    toJpeg: (node: Node, options?: Options) => Promise<string>;
    toBlob: (node: Node, options?: Options) => Promise<Blob>;
    toPixelData: (node: Node, options?: Options) => Promise<Uint8ClampedArray>;
    toSvg: (node: Node, options?: Options) => Promise<string>;
  };

  export default domtoimage;
}
