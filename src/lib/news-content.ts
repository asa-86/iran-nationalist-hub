const IMAGE_EXTENSION_PATTERN =
  /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

export function isImageUrl(value: string) {
  try {
    const url = new URL(value.trim());

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      IMAGE_EXTENSION_PATTERN.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function imageUrlToMarkdown(value: string) {
  const url = value.trim();

  return isImageUrl(url) ? `![](${url})` : value;
}

export function normalizeNewsImageLinks(content: string) {
  return content
    .split("\n")
    .map((line) => {
      const value = line.trim();

      if (!isImageUrl(value)) {
        return line;
      }

      const indentation = line.slice(
        0,
        line.indexOf(value),
      );

      return `${indentation}${imageUrlToMarkdown(value)}`;
    })
    .join("\n");
}
