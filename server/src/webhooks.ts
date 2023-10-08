import type { Request, Response } from "express"
import { stripe } from "."
import { env } from "./env"
import Stripe from "stripe"
import { getFirestore } from "firebase-admin/firestore"
import { firestore } from "firebase-admin"

const webhookHandler: Partial<
  Record<Stripe.Event.Type, (event: any) => Promise<unknown>>
> = {
  "checkout.session.completed": async (_: Stripe.Event.Data) => {
    // Add your business logic here
  },
  "payment_intent.succeeded": async (_: Stripe.PaymentIntent) => {
    // Add your business logic here
  },
  "payment_intent.payment_failed": async (_: Stripe.PaymentIntent) => {
    // Add your business logic here
  },
  "customer.subscription.deleted": async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer

    const userId = customer.metadata.firestoreUID
    const db = getFirestore()
    const userRef = db.collection("users").doc(userId)

    await userRef.update({
      activePlans: firestore.FieldValue.arrayRemove(data.id),
    })
  },
  "customer.subscription.created": async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer
    const userId = customer.metadata.firestoreUID
    const db = getFirestore()
    const userRef = db.collection("users").doc(userId)

    await userRef.update({
      activePlans: firestore.FieldValue.arrayUnion(data.id),
    })
  },
  "invoice.payment_succeeded": async (_: Stripe.Invoice) => {
    // Add your business logic here
  },
  "invoice.payment_failed": async (data: Stripe.Invoice) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer
    const db = getFirestore()
    const userSnapshot = await db
      .collection("users")
      .doc(customer.metadata.firestoreUID)
      .get()
    await userSnapshot.ref.update({ status: "PAST_DUE" })
  },
}

export default async function handleStripeWebhooks(
  req: Request,
  res: Response
) {
  const sig = req.headers["stripe-signature"] as string

  if (typeof sig !== "string" || !req.rawBody)
    throw new Error("Signature or Buffer is missing/invalid")

  const event = stripe.webhooks.constructEvent(
    req.rawBody,
    sig,
    env.STRIPE_WEBHOOK_SECRETS
  )

  try {
    const currentWebhookHandler = webhookHandler[event.type]
    if (typeof currentWebhookHandler === "function") {
      console.error(`✅ Event \`${event.type}\` is supported`)
      event.data.object
      await currentWebhookHandler(event.data.object)
      res.send()
    } else {
      res.status(400).send()
      console.error(`❌ Event \`${event.type}\` is not supported`)
    }
  } catch (e) {
    console.error("Webhooks Error:", e)
    res.status(400).send()
  }
}
