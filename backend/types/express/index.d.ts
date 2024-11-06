import { AccessToken } from "../../src/utils/authUtils"

declare global {
  namespace Express {
    interface Request {
      // UUID for every single request for logging purposes
      id: string
      /**
        Hold user's data thats propagated to route methods
        to authenticate user
      */
      __userAuth: Omit<AccessToken, 'passwordHash'>
    }
  }
}
