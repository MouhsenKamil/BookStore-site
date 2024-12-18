import { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { HttpError } from '../utils/exceptions'


export const emailValidator = body('email').isEmail().withMessage('Valid email is required')
export const passwordValidator = body('password').notEmpty().withMessage('Password field is required')

export const emailPasswordValidators = [emailValidator, passwordValidator]

export const nameInBodyExists = checkRequestAttrs({obj: 'body', must: ['name']})
export const queryInParamExists = checkRequestAttrs({obj: 'query', must: ['query']})
export const restrictEditingSensibleInfo = checkRequestAttrs(
  { obj: 'body', mustNot: ['type', 'passwordHash'] }
)

type CheckRequestAttrsProps = {
  obj: 'body' | 'params' | 'query'
} & (
  {
    must: Array<string>
    mustNot?: Array<string>
  } | {
    must?: Array<string>
    mustNot: Array<string>
  }
)


/**
 * Check whether the `express.Request` object has all the properties that are listed
 * in `must` parameter, and it does not have any of the properties that are listed in
 * `mustNot` parameter.
 * 
 * @param obj - The `express.Request` attribute in which you want to perform the checks.
 * @param must - The list of properties that must be found in `obj`.
 * @param mustNot - The list of properties that must not be found in `obj`.
 * 
 * @returns - An express.js middleware that does these checks.
 */
export function checkRequestAttrs({obj, must=[], mustNot: mustNot=[]}: CheckRequestAttrsProps) {
  return (req: Request, res: Response, next: NextFunction) => {
    const reqObj = req[obj]
    const unnecessaryData = mustNot.filter(attr => reqObj[attr] !== undefined)

    if (unnecessaryData.length)
      throw new HttpError(
        `Unknown value${unnecessaryData.length ? 's': ''}: ${unnecessaryData}`, {
          statusCode: 422,
          debugMsg: `unknown values from request's ${obj} - ${unnecessaryData}`
      })

    const requiredData = must.filter(attr => reqObj[attr] === undefined)

    if (requiredData.length)
      throw new HttpError(
        `${requiredData} ${requiredData.length ? 'is': 'are'} required`, {
          statusCode: 422,
          debugMsg: `missing values from request's ${obj} - ${requiredData}`
      })

    next()
  }
}
