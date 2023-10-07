import { getFirestore } from "firebase-admin/firestore"
import Stripe from "stripe"
import { stripe } from "."

export async function upsertCustomer(
  userId: string,
  params?: Stripe.CustomerCreateParams
) {
  const userSnapshot = await getFirestore()
    .collection("users")
    .doc(userId)
    .get()

  const { stripeCustomerId, email } = userSnapshot.data() as {
    stripeCustomerId?: string
    email: string
  }

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
