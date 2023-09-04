import { stripe } from "."

export default function createStripePaymentIntent(amount: number) {
  return stripe.paymentIntents.create({ amount, currency: "pkr" })
}
