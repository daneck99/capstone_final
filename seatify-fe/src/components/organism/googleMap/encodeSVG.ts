 

export const encodeSVG = (rawSvgString: string): string => {
  // eslint-disable-next-line no-useless-escape
  const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

  // Use single quotes instead of double to avoid URI encoding
  // eslint-disable-next-line no-param-reassign
  rawSvgString = rawSvgString
    .replace(/'/g, '"')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ');

  return `data:image/svg+xml;utf-8,${rawSvgString.replace(
    symbols,
    encodeURIComponent
  )}`;
};
