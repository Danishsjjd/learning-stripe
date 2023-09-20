import { stripe } from "."

export default function createStripePaymentIntent({
  amount,
}: {
  amount: number
}) {
  return stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  })
}
