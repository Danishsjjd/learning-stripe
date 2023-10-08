import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(
  "pk_test_51Nz0iwCwDMOWi2D3D16hVwf9KPys9dbdAOqE5zeuQnbnN8SzzIKbo0YNuneczmnncm3HK12Y6Jc21GBjKifs4DgG00mf10jXLg"
)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
)
