export interface UserAuthData {
  id: string,
  type: UserType,
}

declare global {
  namespace Express {
    interface Request {
      /**
        Hold user's data thats propagated to route methods
        to authenticate user
      */
      __userAuth: UserAuthData
    }
  }
}
