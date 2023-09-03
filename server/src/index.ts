import { app } from "./api"
import { env } from "./env"
import Stripe from "stripe"

const stripe = new Stripe(env.STRIPE_SECRET, { apiVersion: "2023-08-16" })

app.listen(env.PORT, () => {
  console.log(`server is running at: ${env.PORT} 🚀`)
})
