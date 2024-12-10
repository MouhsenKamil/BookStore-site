interface BackendErrorOptionsProp {
  cause?: Error
  debugMsg?: string
}


interface HttpErrorOptionsProp extends BackendErrorOptionsProp {
  statusCode?: number
}


export class BackendError extends Error {
  debugMsg: string

  constructor(message: string, options?: BackendErrorOptionsProp) {
    const { debugMsg = '', ...otherOptions } = options || {}
    super(message, otherOptions)
    this.debugMsg = debugMsg
    Object.setPrototypeOf(this, BackendError.prototype)
  }
}


export class HttpError extends BackendError {
  statusCode: number

  constructor(message: string, options: HttpErrorOptionsProp = {}) {
    const { statusCode = 500, ...otherOptions } = options
    super(message, otherOptions)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}


export class RenewAccessToken extends BackendError {
  userId: string

  constructor(userId: string) {
    super('', {})
    this.userId = userId
    Object.setPrototypeOf(this, RenewAccessToken.prototype)
  }
}


export class Redirect extends HttpError {
  path: string

  constructor(message: string, path: string, options: HttpErrorOptionsProp = {}) {
    options.statusCode = options.statusCode ?? 200
    super(message, options)
    this.path = path
    Object.setPrototypeOf(this, ForceReLogin.prototype)
  }
}


export class ForceReLogin extends Redirect {
  constructor(message: string, options: HttpErrorOptionsProp = {}) {
    options.statusCode = options.statusCode ?? 200
    super(message, '/login', options)
    Object.setPrototypeOf(this, ForceReLogin.prototype)
  }
}


export class NewUserError extends HttpError {
  constructor(message: string, options?: HttpErrorOptionsProp) {
    super(message, options)
    Object.setPrototypeOf(this, NewUserError.prototype)
  }
}
