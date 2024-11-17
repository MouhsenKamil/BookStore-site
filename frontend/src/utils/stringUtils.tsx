export function titleCase(str: string) {
  if (!str.length)
    return str
  return str.at(0)?.toUpperCase() + str.slice(1, str.length).toLocaleLowerCase()
}
