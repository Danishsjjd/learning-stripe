import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import fetchFromAPI from "../helpers"
import { FormEvent, useEffect, useState } from "react"
import type { PaymentMethod, SetupIntent } from "@stripe/stripe-js"

const Customers = () => {
  const [wallets, setWallets] = useState<PaymentMethod[]>([])
  const [setupIntent, setSetupIntents] = useState<SetupIntent | null>(null)

  const element = useElements()
  const stripe = useStripe()

  const getWallet = async () =>
    setWallets(await fetchFromAPI({ uri: "wallet", method: "GET" }))

  const createSetupIntent = async () => {
    setSetupIntents((await fetchFromAPI({ uri: "wallet" })) as SetupIntent)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!setupIntent || !setupIntent.client_secret) return

    const cardElement = element?.getElement(CardElement)
    if (!cardElement) return

    const res = await stripe?.confirmCardSetup(setupIntent.client_secret, {
      payment_method: { card: cardElement },
    })
    if (res) {
      const { error, setupIntent: setupIntentUpdated } = res
      if (error) {
        alert(error.message)
      } else {
        setSetupIntents(setupIntentUpdated)
        await getWallet()
        alert("success!!")
        cardElement.clear()
      }
    } else {
      alert("something went wrong")
    }
  }

  useEffect(() => {
    getWallet()
  }, [])

  return (
    <>
      <h2>Customers</h2>

      <p>
        Save credit card details for future use. Connect a Stripe Customer ID to
        a Firebase User ID.
      </p>

      <div className="well">
        <h3>Step 1: Create a Setup Intent</h3>

        <button
          className="btn btn-success"
          onClick={createSetupIntent}
          disabled={!!setupIntent}
        >
          Attach New Credit Card
        </button>
      </div>
      <hr />

      <form
        onSubmit={handleSubmit}
        className="well"
        hidden={!setupIntent || setupIntent.status === "succeeded"}
      >
        <h3>Step 2: Submit a Payment Method</h3>
        <p>Collect credit card details, then attach the payment source.</p>
        <p>
          Normal Card: <code>4242424242424242</code>
        </p>
        <p>
          3D Secure Card: <code>4000002500003155</code>
        </p>

        <hr />

        <CardElement />
        <button className="btn btn-success" type="submit">
          Attach
        </button>
      </form>

      <div className="well">
        <h3>Retrieve all Payment Sources</h3>
        <select className="form-control">
          {wallets.map((paymentSource) => (
            <CreditCard key={paymentSource.id} card={paymentSource.card} />
          ))}
        </select>
      </div>
    </>
  )
}

const CreditCard = ({ card }: { card: PaymentMethod["card"] }) => {
  if (card) {
    const { last4, brand, exp_month, exp_year } = card

    return (
      <option>
        {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
      </option>
    )
  }

  return null
}

export default Customers
