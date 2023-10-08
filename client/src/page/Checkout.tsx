import { useState } from "react"
import fetchFromAPI from "../helpers"
import { useStripe } from "@stripe/react-stripe-js"

const product = {
  name: "dish",
  description: "awesome dish!",
  images: ["https://mui.com/static/images/cards/paella.jpg"],
  amount: 500, // $5
  currency: "usd",
}

const Checkout = () => {
  const stripe = useStripe()
  const [quantity, setQuantity] = useState(0)

  const onCheckout = async () => {
    const { id: sessionId } = await fetchFromAPI({
      uri: "checkout",
      body: {
        line_items: [
          {
            quantity,
            price_data: {
              unit_amount: product.amount,
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description,
                images: product.images,
              },
            },
          },
        ],
      },
    })
    stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <>
      <h2>Stripe Checkout</h2>
      <p>
        Shopping-cart scenario. Change the quantity of the products below, then
        click checkout to open the Stripe Checkout window.
      </p>

      <div className="product">
        <h3>{product.name}</h3>
        <h4>Stripe Amount: {product.amount}</h4>

        <img src={product.images[0]} width="250px" alt="product" />

        <button
          className="btn btn-sm btn-warning"
          onClick={() => setQuantity((pre) => Math.max(0, --pre))}
        >
          -
        </button>
        <span style={{ margin: "20px", fontSize: "2em" }}>{quantity}</span>
        <button
          className="btn btn-sm btn-success"
          onClick={() => setQuantity((pre) => ++pre)}
        >
          +
        </button>
      </div>

      <hr />

      <button
        className="btn btn-primary"
        onClick={onCheckout}
        disabled={!quantity}
      >
        Start Checkout
      </button>
    </>
  )
}

export default Checkout
