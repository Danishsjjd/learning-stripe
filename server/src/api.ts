import express from "express"
import cors from "cors"
import createStripeCheckoutSession from "./checkout"
import createStripePaymentIntent from "./payments"
import handleStripeWebhooks from "./webhooks"

const app = express()

app.use(
  express.json({
    verify: (req, _, buf) => (req["rawBody"] = buf),
  })
)
app.use(cors())

// TODO: catch-error
app.post("/checkout", async ({ body }, res) =>
  res.send(await createStripeCheckoutSession(body.line_items))
)

// TODO: catch-error
app.post("/payments", async ({ body }, res) =>
  res.send(await createStripePaymentIntent(body))
)

app.post("/hooks", handleStripeWebhooks)

export { app }
