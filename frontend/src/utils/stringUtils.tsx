export function toTitleCase(text: string) {
  if (!text.length)
    return text

  return text
    .split(' ')
    .map(str => str.at(0)?.toUpperCase() + str.slice(1, str.length).toLocaleLowerCase())
    .join(' ')
}
