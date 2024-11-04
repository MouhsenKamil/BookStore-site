import path from "path"
import dotenv from "dotenv"


dotenv.config({ path: path.resolve(__dirname, "../../../.env") })


interface ENV {
  // admin credentials
  MONGODB_ADMIN_USERNAME?: string
  MONGODB_ADMIN_PASSWORD?: string

  // sample user credentials
  MONGODB_USER_USERNAME?: string
  MONGODB_USER_PASSWORD?: string

  BOOKSTORE_DB_NAME?: string

  BACKEND_PORT?: number
  MONGODB_PORT?: number

  ACCESS_TOKEN_SECRET?: string
  REFRESH_TOKEN_SECRET?: string

  CLIENT_ID_SECRET?: string
  CLIENT_ID_SALT?: string

  // Cookie names to store tokens
  REFRESH_TOKEN_COOKIE_NAME?: string

  ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME?: string
  ACCESS_TOKEN_SIGN_COOKIE_NAME?: string

  // secret for cookieSession middleware
  COOKIE_SESSION_SECRET?: string
}

type Config = Required<ENV>


function getConfig(): ENV {
  return {
    MONGODB_ADMIN_USERNAME: process.env.MONGODB_ADMIN_USERNAME,
    MONGODB_ADMIN_PASSWORD: process.env.MONGODB_ADMIN_PASSWORD,

    MONGODB_USER_USERNAME: process.env.MONGODB_USER_USERNAME,
    MONGODB_USER_PASSWORD: process.env.MONGODB_USER_PASSWORD,

    BOOKSTORE_DB_NAME: process.env.BOOKSTORE_DB_NAME,

    BACKEND_PORT: process.env.BACKEND_PORT
      ? Number(process.env.BACKEND_PORT)
      : undefined,
    MONGODB_PORT: process.env.BACKEND_PORT
      ? Number(process.env.MONGODB_PORT)
      : undefined,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

    CLIENT_ID_SECRET: process.env.CLIENT_ID_SECRET,
    CLIENT_ID_SALT: process.env.CLIENT_ID_SALT,

    REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME,

    ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME: process.env.ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME,
    ACCESS_TOKEN_SIGN_COOKIE_NAME: process.env.ACCESS_TOKEN_SIGN_COOKIE_NAME,

    COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET,
  }
}


function getSanitzedConfig(config: ENV): Config {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined)
      throw new Error(`Missing key ${key} in .env`)
  }
  return config as Config
}

const config = getConfig()
export default getSanitzedConfig(config)
