import * as musicMetadata from "music-metadata-browser";

export const clone = (object) => JSON.parse(JSON.stringify(object))

export const removeUndefiedField = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};

export const displayNote = (note) => {
  switch (note) {
    case "C":
      return "โด";
    case "D":
      return "เร";
    case "E":
      return "มี";
    case "F":
      return "ฟา";
    case "G":
      return "ซอล";
    case "A":
      return "ลา";
    case "B":
      return "ที";
    case "C2":
      return "โดสูง";
    default:
      return "";
  }
};

export const getCoverFromMp3 = (file) =>
  musicMetadata.parseBlob(file).then((metadata) => {
    if (
      metadata &&
      metadata.common.picture &&
      metadata.common.picture.length > 0
    ) {
      const data = metadata.common.picture[0].data;
      const format = metadata.common.picture[0].format;
      return URL.createObjectURL(new Blob([data.buffer], { type: format }));
    }
    return null;
  });

export const getCoverFromUrl = (url) =>
  musicMetadata.fetchFromUrl(url).then((metadata) => {
    if (
      metadata &&
      metadata.common.picture &&
      metadata.common.picture.length > 0
    ) {
      const data = metadata.common.picture[0].data;
      const format = metadata.common.picture[0].format;
      return URL.createObjectURL(new Blob([data.buffer], { type: format }));
    }
    return null;
  });
