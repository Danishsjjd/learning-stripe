import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import fetchFromAPI from "../helpers"
import { FormEvent, useEffect, useState } from "react"
import type { PaymentMethod, SetupIntent } from "@stripe/stripe-js"
import { Button } from "@mui/material"

const Customers = () => {
  return (
    <>
      <SaveCard />
    </>
  )
}

const SaveCard = () => {
  const [wallets, setWallets] = useState<PaymentMethod[]>([])
  const [setupIntents, setSetupIntents] = useState<SetupIntent | null>(null)

  const element = useElements()
  const stripe = useStripe()

  const getWallet = async () =>
    setWallets(await fetchFromAPI({ uri: "wallet", method: "GET" }))

  const createSetupIntent = async () => {
    setSetupIntents((await fetchFromAPI({ uri: "wallet" })) as SetupIntent)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!setupIntents || !setupIntents.client_secret) return

    const cardElement = element?.getElement(CardElement)
    if (!cardElement) return

    const res = await stripe?.confirmCardSetup(setupIntents.client_secret, {
      payment_method: { card: cardElement },
    })
    if (res) {
      const { error, setupIntent: setupIntentUpdated } = res
      if (error) {
        alert(error)
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
      <Button onClick={createSetupIntent} disabled={!!setupIntents}>
        Add New Card
      </Button>

      {setupIntents && (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <Button>Submit</Button>
        </form>
      )}

      <select>
        {wallets.map((wallet, i) => (
          <CreditCard card={wallet.card} key={i} />
        ))}
      </select>
    </>
  )
}

const CreditCard = ({ card }: { card: PaymentMethod["card"] }) => {
  if (card)
    return (
      <option>
        {card.brand} **** **** **** {card.last4} expires {card.exp_month}/
        {card.exp_year}
      </option>
    )
  return null
}

export default Customers
