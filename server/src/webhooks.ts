import type { Request, Response } from "express"
import { stripe } from "."
import { env } from "./env"
import Stripe from "stripe"

const webhookHandler: Partial<
  Record<Stripe.Event.Type, (event: any) => Promise<unknown>>
> = {
  "payment_intent.created": async (obj: Stripe.PaymentIntent) => {
    console.info("payment intent amount:", obj.amount)
  },
}

export default async function handleStripeWebhooks(
  req: Request,
  res: Response
) {
  const sig = req.headers["stripe-signature"] as string

  if (typeof sig !== "string" || !req.rawBody)
    throw new Error("Signature or Buffer is missing/invalid")

  // TODO: is it will throw error?
  const event = stripe.webhooks.constructEvent(
    req.rawBody,
    sig,
    env.STRIPE_WEBHOOK_SECRETS
  )

  try {
    const currentWebhookHandler = webhookHandler[event.type]
    if (typeof currentWebhookHandler === "function") {
      event.data.object
      await currentWebhookHandler(event.data.object)
      res.send()
    } else {
      res.status(400).send()
      console.error(`Event \`${event.type}\` is not supported`)
    }
  } catch (e) {
    console.error("Webhooks Error:", e)
    res.status(400).send()
  }
}
