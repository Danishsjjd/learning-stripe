import express from "express"
import cors from "cors"
import createStripeCheckoutSession from "./checkout"
import createStripePaymentIntent from "./payments"
import handleStripeWebhooks from "./webhooks"

const app = express()

app.use(
  express.json({
    verify: (req, _, buf) => {
      // TODO: check (chat-gpt will check chat)
      return (req["rawBody"] = buf)
    },
  })
)
app.use(cors())

// Always decide how much to charge on the server side, a trusted environment, as opposed to the client. This prevents malicious customers from being able to choose their own prices.
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
