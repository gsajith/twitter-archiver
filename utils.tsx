export function isValidUrl(s:string) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}

export function isTwitterUrl(s: string) {
  if (!isValidUrl(s)) return false;

  const parsedUrl = new URL(s);
  return parsedUrl.host === "twitter.com";
}
