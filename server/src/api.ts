import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import createStripeCheckoutSession from "./checkout"
import createStripePaymentIntent from "./payments"
import handleStripeWebhooks from "./webhooks"
import { getAuth } from "firebase-admin/auth"
import { createSetupIntent, listPaymentMethods } from "./customer"
import { createSubscription } from "./billing"

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

app.post("/checkout", async (req: Request, res) => {
  res.send(await createStripeCheckoutSession(req.body.line_items))
})

app.post("/payments", async ({ body }, res) =>
  res.send(await createStripePaymentIntent(body))
)

app.post("/wallet", async (req, res) => {
  const user = validateUser(req)

  return res.send(await createSetupIntent({ userId: user.uid }))
})

app.get("/wallet", async (req, res) => {
  const user = validateUser(req)

  return res.send((await listPaymentMethods({ userId: user.uid })).data)
})

app.post("/subscriptions/", async (req: Request, res: Response) => {
  const user = validateUser(req)
  const { plan, payment_method } = req.body
  const subscription = await createSubscription(user.uid, plan, payment_method)

  res.send(subscription)
})

app.post("/hooks", handleStripeWebhooks)

async function decodeJWT(req: Request, _: Response, next: NextFunction) {
  const authToken = req.headers["authorization"]
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
