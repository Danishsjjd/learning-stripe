import "express-async-errors"
import { app } from "./api"
import { env } from "./env"
import Stripe from "stripe"

import { initializeApp } from "firebase-admin/app"

initializeApp()

export const stripe = new Stripe(env.STRIPE_SECRET, {
  apiVersion: "2023-08-16",
})

app.listen(env.PORT, () => {
  console.info(`server is running at: ${env.PORT} 🚀`)
})
