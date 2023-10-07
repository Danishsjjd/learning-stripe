import { DecodedIdToken } from "firebase-admin/auth"

declare module "http" {
  interface IncomingMessage {
    rawBody: Buffer
  }
}

declare module "express" {
  interface Request {
    user?: DecodedIdToken
  }
}
