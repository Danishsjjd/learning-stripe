import Stripe from "stripe"
import { stripe } from "."
import { env } from "./env"

export default function createStripeCheckoutSession(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${env.WEBAPP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.WEBAPP_URL}/failed?session_id={CHECKOUT_SESSION_ID}`,
  })
}
