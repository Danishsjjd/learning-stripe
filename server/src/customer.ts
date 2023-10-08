import { getFirestore } from "firebase-admin/firestore"
import Stripe from "stripe"
import { stripe } from "."

// ! this function can create multiple customers with same mail when calling it the the same time so you can cache the uid to check if it pending state of creating the stripe customer
export async function upsertCustomer(
  userId: string,
  params?: Stripe.CustomerCreateParams
) {
  const userSnapshot = await getFirestore()
    .collection("users")
    .doc(userId)
    .get()

  const data = userSnapshot.data()

  const { stripeCustomerId, email } = data
    ? data
    : { stripeCustomerId: "", email: "" }

  if (stripeCustomerId) {
    return stripe.customers.retrieve(
      stripeCustomerId
    ) as Promise<Stripe.Customer>
  } else {
    const customer = await stripe.customers.create({
      ...params,
      email,
      metadata: {
        firestoreUID: userId,
      },
    })

    await userSnapshot.ref.update({ stripeCustomerId: customer.id })

    return customer
  }
}

export async function createSetupIntent({ userId }: { userId: string }) {
  const customer = await upsertCustomer(userId)

  return stripe.setupIntents.create({
    customer: customer.id,
  })
}

export const listPaymentMethods = async ({ userId }: { userId: string }) => {
  const customer = await upsertCustomer(userId)

  return stripe.paymentMethods.list({ customer: customer.id, type: "card" })
}
