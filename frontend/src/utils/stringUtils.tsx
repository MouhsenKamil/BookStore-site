export function toTitleCase(text: string) {
  if (!text.length)
    return text

  return text
    .split(' ')
    .map(str => str.at(0)?.toUpperCase() + str.slice(1, str.length).toLocaleLowerCase())
    .join(' ')
}


export function getTimeDiff(datetime1: Date, datetime2?: Date) {
  let datetimeDiff = datetime1.getTime() - (datetime2?.getTime() ?? Date.now())
  if (isNaN(datetimeDiff))
    return ""

  let now = Date.now()
  let milisecDiff = (datetimeDiff < now) ? now - datetimeDiff: datetimeDiff - now
  let days = Math.floor(milisecDiff / 1000 / 60 / (60 * 24))
  let dateDiff = new Date(milisecDiff)
  return days + " Days " +
         dateDiff.getHours() + " Hours " +
         dateDiff.getMinutes() + " Minutes " +
         dateDiff.getSeconds() + " Seconds"
}
