import React from "react"
import ReactDOM from "react-dom/client"
import Root from "./App.tsx"
import "./index.css"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(
  "pk_test_51NsVdqJpkbEUTyeTnF5xBXITj49utXfVvwFWROr1MwQKs8o6NC62aCzbMBSoVu9eH0zmowsTajQvtLoKhLdZXvAx00h2h2jRdU"
)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <Root />
    </Elements>
  </React.StrictMode>
)
