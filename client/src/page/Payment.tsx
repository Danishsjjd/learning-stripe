import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import type { PaymentIntent, StripeCardElement } from "@stripe/stripe-js"
import { FormEvent, useState } from "react"
import fetchFromAPI from "../helpers"

const Payment = () => {
  const stripe = useStripe()
  const elements = useElements()

  const [amount, setAmount] = useState(0)
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>()

  const onPiSecret = async (e: FormEvent) => {
    e.preventDefault()

    if (paymentIntent) return

    const validAmount = Math.max(1, Math.min(9_999_999, amount))
    setAmount(validAmount)

    const res = (await fetchFromAPI({
      uri: "payments",
      body: { amount: validAmount },
    })) as PaymentIntent
    setPaymentIntent(res)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const cardElement = elements?.getElement(CardElement)
    const cardPayment = await stripe?.confirmCardPayment(
      paymentIntent?.client_secret as string,
      {
        payment_method: {
          card: cardElement as StripeCardElement,
        },
      }
    )
    if (!cardPayment || cardPayment.error) {
      console.error("error:", cardPayment?.error)
      // if there is an error then stripe return an payment_intent on error object
      cardPayment?.error && setPaymentIntent(cardPayment.error.payment_intent)
    } else {
      console.info("success:", cardPayment.paymentIntent)
      setPaymentIntent(cardPayment.paymentIntent)
    }
  }

  return (
    <>
      <h2>Payments</h2>
      <p>One-time payment scenario.</p>
      <div className="well">
        <PaymentIntentData data={paymentIntent} />
      </div>

      <div className="well">
        <h3>Step 1: Create a Payment Intent</h3>
        <p>
          Change the amount of the payment in the form, then request a Payment
          Intent to create context for one-time payment. Min 50, Max 9999999
        </p>

        <form className="form-inline" onSubmit={onPiSecret}>
          <input
            className="form-control"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={!!paymentIntent}
          />
          <button
            className="btn btn-success"
            disabled={amount <= 0}
            hidden={!!paymentIntent}
          >
            Ready to Pay ${(amount / 100).toFixed(2)}
          </button>
        </form>
      </div>

      <hr />

      <form
        onSubmit={handleSubmit}
        className="well"
        hidden={!paymentIntent || paymentIntent.status === "succeeded"}
      >
        <h3>Step 2: Submit a Payment Method</h3>
        <p>Collect credit card details, then submit the payment.</p>
        <p>
          Normal Card: <code>4242424242424242</code>
        </p>
        <p>
          3D Secure Card: <code>4000002500003155</code>
        </p>

        <hr />

        <CardElement />
        <button className="btn btn-success" type="submit">
          Pay
        </button>
      </form>
    </>
  )
}

function PaymentIntentData(props: { data?: PaymentIntent }) {
  if (props.data) {
    const { id, amount, status, client_secret } = props.data
    return (
      <>
        <h3>
          Payment Intent{" "}
          <span
            className={
              "badge " +
              (status === "succeeded" ? "badge-success" : "badge-secondary")
            }
          >
            {status}
          </span>
        </h3>
        <pre>
          ID: {id} <br />
          Client Secret: {client_secret} <br />
          Amount: {amount} <br />
          Status:{status}
          <br />
        </pre>
      </>
    )
  } else {
    return <p>Payment Intent Not Created Yet</p>
  }
}

export default Payment
