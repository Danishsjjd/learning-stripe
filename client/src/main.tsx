import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(
  "pk_test_51NJiDmSE1Dv7CkE3P6iDfi4NZ0OmzjoFG94crX69pSBQvGL3uHuSuoGWB8klOnHURTbJTY1bbaXv3KFyhEkL3aCY00Ryu74iJz"
)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
)
