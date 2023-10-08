import { useState, useEffect, FormEvent } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import { auth, fireStore } from "../config/firebase"
import { collection, doc, onSnapshot } from "firebase/firestore"
import fetchFromAPI from "../helpers"
import { PaymentMethod } from "@stripe/stripe-js"
import type { Stripe } from "stripe"

function UserData() {
  const user = auth.currentUser

  const [data, setData] = useState<Record<string, string>>({})

  // Subscribe to the user's data in Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(collection(fireStore, "users"), user?.uid),
      (doc) => {
        const data = doc.data()
        data && setData(data)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  return (
    <pre>
      Stripe Customer ID: {data.stripeCustomerId} <br />
      Subscriptions: {JSON.stringify(data.activePlans || [])}
    </pre>
  )
}

export default function Subscriptions() {
  const stripe = useStripe()
  const elements = useElements()
  const user = auth.currentUser

  const [plan, setPlan] = useState<string>()
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([])
  const [loading, setLoading] = useState(false)

  // Get current subscriptions on mount
  useEffect(() => {
    getSubscriptions()
  }, [user])

  // Fetch current subscriptions from the API
  const getSubscriptions = async () => {
    if (user) {
      const subs = await fetchFromAPI({ method: "GET", uri: "subscriptions" })
      setSubscriptions(subs)
    }
  }

  // Cancel a subscription
  const cancel = async (id: string) => {
    setLoading(true)
    await fetchFromAPI({ uri: "subscriptions/" + id, method: "PATCH" })
    alert("canceled!")
    await getSubscriptions()
    setLoading(false)
  }

  // Handle the submission of card details
  const handleSubmit = async (event: FormEvent) => {
    setLoading(true)
    event.preventDefault()

    const cardElement = elements?.getElement(CardElement)
    if (!cardElement) return

    // Create Payment Method
    const res = await stripe?.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (res?.error || !res) {
      alert(res?.error.message)
      setLoading(false)
      return
    }

    const { paymentMethod } = res as { paymentMethod: PaymentMethod }

    // Create Subscription on the Server
    const subscription = await fetchFromAPI({
      uri: "subscriptions",
      body: {
        plan,
        payment_method: paymentMethod.id,
      },
    })

    // The subscription contains an invoice
    // If the invoice's payment succeeded then you're good,
    // otherwise, the payment intent must be confirmed

    const { latest_invoice } = subscription

    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent

      if (status === "requires_action") {
        const confirmRes = await stripe?.confirmCardPayment(client_secret)
        if (confirmRes?.error) {
          console.error(confirmRes.error)
          alert("unable to confirm card")
          return
        }
      }

      // success
      alert("You are subscribed!")
      getSubscriptions()
    }

    setLoading(false)
    setPlan(undefined)
  }

  return (
    <>
      <h2>Subscriptions</h2>
      <p>
        Subscribe a user to a recurring plan, process the payment, and sync with
        Firestore in realtime.
      </p>

      <div className="well">
        <h2>Firestore Data</h2>
        <p>User's data in Firestore.</p>
        {user?.uid && <UserData />}
      </div>

      <hr />

      <div className="well">
        <h3>Step 1: Choose a Plan</h3>

        <button
          className={
            "btn " +
            (plan === "price_1Nz2wCCwDMOWi2D3aHiFJZKf"
              ? "btn-primary"
              : "btn-outline-primary")
          }
          onClick={() => setPlan("price_1Nz2wCCwDMOWi2D3aHiFJZKf")}
        >
          Choose Monthly $25/m
        </button>

        <button
          className={
            "btn " +
            (plan === "price_1Nz31OCwDMOWi2D3UOA5DzCI"
              ? "btn-primary"
              : "btn-outline-primary")
          }
          onClick={() => setPlan("price_1Nz31OCwDMOWi2D3UOA5DzCI")}
        >
          Choose Quarterly $50/q
        </button>

        <p>
          Selected Plan: <strong>{plan}</strong>
        </p>
      </div>
      <hr />

      <form onSubmit={handleSubmit} className="well" hidden={!plan}>
        <h3>Step 2: Submit a Payment Method</h3>
        <p>Collect credit card details</p>
        <p>
          Normal Card: <code>4242424242424242</code>
        </p>
        <p>
          3D Secure Card: <code>4000002500003155</code>
        </p>

        <hr />

        <CardElement />
        <button className="btn btn-success" type="submit" disabled={loading}>
          Subscribe & Pay
        </button>
      </form>

      <div className="well">
        <h3>Manage Current Subscriptions</h3>
        <div>
          {subscriptions.map((sub) => (
            <div key={sub.id}>
              {sub.id}. Next payment of {`{sub.plan.amount}`} due{" "}
              {new Date(sub.current_period_end * 1000).toUTCString()}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => cancel(sub.id)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
