import { stripe } from "."
import Stripe from "stripe"
import { upsertCustomer } from "./customer"
import { firestore } from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"

/**
 * Attaches a payment method to the Stripe customer,
 * subscribes to a Stripe plan, and saves the plan to Firestore
 */
export async function createSubscription(
  userId: string,
  plan: string,
  payment_method: string
) {
  const customer = await upsertCustomer(userId)

  // Attach the  payment method to the customer
  await stripe.paymentMethods.attach(payment_method, { customer: customer.id })

  // (optional: user can have default payment method) Set it as the default payment method
  // it will create a new payment method every time so be careful to call it
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: payment_method },
  })

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ["latest_invoice.payment_intent"],
  })

  const invoice = subscription.latest_invoice as Stripe.Invoice
  const payment_intent = invoice.payment_intent as Stripe.PaymentIntent

  // Update the user's status
  if (payment_intent.status === "succeeded") {
    const userSnapshot = getFirestore()
    await userSnapshot
      .collection("users")
      .doc(userId)
      .set(
        {
          stripeCustomerId: customer.id,
          activePlans: firestore.FieldValue.arrayUnion(subscription.id),
        },
        { merge: true }
      )
  }

  return subscription
}

/**
 * Cancels an active subscription, syncs the data in Firestore
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
) {
  const customer = await upsertCustomer(userId)
  if (customer.metadata.firestoreUID !== userId) {
    throw Error("Firebase UID does not match Stripe Customer")
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId)

  // Cancel at end of period
  // const subscription = stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

  if (subscription.status === "canceled") {
    const userSnapshot = getFirestore()

    await userSnapshot
      .collection("users")
      .doc(userId)
      .update({
        activePlans: firestore.FieldValue.arrayRemove(subscription.id),
      })
  }

  return subscription
}

/**
 * Returns all the subscriptions linked to a Firebase userID in Stripe
 */
export async function listSubscriptions(userId: string) {
  const customer = await upsertCustomer(userId)
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  })

  return subscriptions
}
