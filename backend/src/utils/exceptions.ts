export class BackendError extends Error {
  debugMsg: string

  constructor(message: string, options?: { cause?: Error, debugMsg?: string }) {
    const { debugMsg = '', ...otherOptions } = options || {}
    super(message, otherOptions)
    this.debugMsg = debugMsg
    Object.setPrototypeOf(this, BackendError.prototype)
  }
}

export class HttpError extends BackendError {
  statusCode: number

  constructor(message: string, options: { statusCode?: number, cause?: Error, [key: string]: any, debugMsg?: string } = {}) {
    const { statusCode = 500, ...otherOptions } = options
    super(message, otherOptions)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export class InvalidToken extends HttpError {}


export class RenewAccessToken extends BackendError {
  userId: string

  constructor(userId: string) {
    super('', {})
    this.userId = userId
    Object.setPrototypeOf(this, RenewAccessToken.prototype)
  }
}


export class RedirectTo extends HttpError {
  constructor(message: string, path: string, options: { statusCode?: number, cause?: Error, [key: string]: any, debugMsg?: string } = {}) {
    options.statusCode = options.statusCode ?? 308
    super(message + ' ' + path, options)
    Object.setPrototypeOf(this, RedirectTo.prototype)
  }
}

export class NewUserError extends HttpError {
  constructor(message: string, options?: { statusCode?: number, cause?: Error }) {
    super(message, options)
    Object.setPrototypeOf(this, NewUserError.prototype)
  }
}
