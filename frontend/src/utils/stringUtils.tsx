export function toTitleCase(text: string) {
  if (!text.length)
    return text

  return text
    .split(' ')
    .map(str => str.at(0)?.toUpperCase() + str.slice(1, str.length).toLocaleLowerCase())
    .join(' ')
}


export function getTimeDiff(datetime1: Date | string | number, datetime2?: Date | string | number) {
  if (datetime1 instanceof Date)
    datetime1 = datetime1.getTime()

  else if (typeof datetime1 === "string")
    datetime1 = new Date(datetime1).getTime()

  if (!datetime2)
    datetime2 = Date.now()

  else if (datetime2 instanceof Date)
    datetime2 = datetime2.getTime()

  else if (typeof datetime2 === "string")
    datetime2 = new Date(datetime2).getTime()

  let datetimeDiff = Math.abs(datetime1 - datetime2)
  console.log("datediff", datetimeDiff)

  if (isNaN(datetimeDiff))
    return ""

  let days = Math.floor(datetimeDiff / 1000 / 60 / (60 * 24))
  let dateDiff = new Date(datetimeDiff)
  let res = ""

  if (days > 0)
    res += days + " days "

  let hours = dateDiff.getHours()
  if (hours == 1)
    res += "in an hour "

  else if (hours > 1)
    res += dateDiff.getHours() + " hours "

  let minutes = dateDiff.getMinutes()
  if (minutes === 1)
    res += "in 1 minute "

  else if (minutes > 1)
    res += dateDiff.getMinutes() + " minutes "

  let seconds = dateDiff.getSeconds()
  if (seconds == 1)
    res += "in 1 second"

  else if (seconds > 1)
    res += dateDiff.getMinutes() + " seconds"

  return res
}
