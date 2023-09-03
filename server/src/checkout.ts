import Stripe from "stripe"
import { stripe } from "."
import { env } from "./env"

export default async function createStripeCheckoutSession(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {
  const url = env.WEBAPP_URL

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/failed?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session
}
