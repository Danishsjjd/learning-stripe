import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { FormEvent, ReactNode, useState } from "react"
import fetchFromAPI from "../helpers"
import type { PaymentIntent, StripeCardElement } from "@stripe/stripe-js"

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
    // TODO: handle error
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {paymentIntent && (
        <Section>
          <Typography variant="h2">Payment Intent</Typography>
          <pre>ID: {paymentIntent.id}</pre>
          <pre>Client Secret: {paymentIntent.client_secret}</pre>
          <pre>Status: {paymentIntent.status}</pre>
        </Section>
      )}
      <Section>
        <Typography variant="body1">Step 1: Amount in cent:</Typography>
        <form style={{ display: "flex", gap: 16 }} onSubmit={onPiSecret}>
          <TextField
            type="number"
            fullWidth
            variant="filled"
            color="success"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={!!paymentIntent}
          />
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={!!paymentIntent}
          >
            Ready to Pay ${(amount / 100).toFixed(2)}
          </Button>
        </form>
      </Section>
      {paymentIntent && (
        <Section>
          <Typography variant="body1">
            Step 2: Submit a Payment Method
          </Typography>
          <Typography variant="subtitle2">
            Collect credit card details, then submit the payment.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              mt: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              Normal Card:{" "}
              <pre style={{ color: "darkblue" }}>4242424242424242</pre>{" "}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              3D Secure Card:{" "}
              <pre style={{ color: "darkblue" }}>4000002500003155</pre>
            </div>
          </Box>
          <form onSubmit={handleSubmit}>
            <CardElement />
            <Button variant="contained" sx={{ marginTop: 1 }} type="submit">
              Pay
            </Button>
          </form>
        </Section>
      )}
    </Box>
  )
}

const Section = ({ children }: { children: ReactNode }) => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "#cfe8fc",
          padding: 2,
          border: "1px solid grey",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Container>
  )
}

export default Payment
