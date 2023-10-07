import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import createStripeCheckoutSession from "./checkout"
import createStripePaymentIntent from "./payments"
import handleStripeWebhooks from "./webhooks"
import { getAuth } from "firebase-admin/auth"

const app = express()

app.use(
  express.json({
    verify: (req, _, buf) => {
      return (req["rawBody"] = buf)
    },
  })
)
app.use(cors())

app.use(decodeJWT)

// Always decide how much to charge on the server side, a trusted environment, as opposed to the client. This prevents malicious customers from being able to choose their own prices.
// TODO: catch-error
app.post("/checkout", async (req: Request, res) => {
  res.send(await createStripeCheckoutSession(req.body.line_items))
})

// TODO: catch-error
app.post("/payments", async ({ body }, res) =>
  res.send(await createStripePaymentIntent(body))
)

app.post("/hooks", handleStripeWebhooks)

async function decodeJWT(req: Request, _: Response, next: NextFunction) {
  const authToken = req.headers["authorization"]
  console.log("authToken", authToken)
  try {
    if (authToken && authToken.startsWith("Bearer ")) {
      const token = authToken.split("Bearer ")[1]
      const user = await getAuth().verifyIdToken(token)

      req.user = user
    }
  } catch (e) {
    console.error("failed to parse token")
  }

  next()
}

function validateUser(req: Request) {
  if (!req.user) {
    throw new Error("You must need to authenticated.")
  }

  return req.user
}

export { app }
