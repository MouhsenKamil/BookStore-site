import { BookUniqueListValues } from "../models/BookUniqueListValues"


export async function metadataListQuerier({param, query}: {
  param: 'authorNames' | 'categories' | 'lang',
  query: string,
}) {
  const res = await BookUniqueListValues.aggregate([
    {
      $project: {
        resultList: {
          $filter: {
            input: `$${param}`,
            as: `${param}1`,
            cond: {
              $regexMatch: {
                input: `$$${param}1`,
                regex: `^${query.replace('/', '\\/')}`,
                options: "i"
              }
            }
          }
        }
      }
    }
  ])

  if (res.length)
    return res[0].resultList

  return []
}
