import { ShoppingBag } from "@mui/icons-material"
import { Button, Divider } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { red } from "@mui/material/colors"
import { useState } from "react"
import fetchFromAPI from "../helpers"
import { useStripe } from "@stripe/react-stripe-js"

const FOOD_AMOUNT = 5

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
              unit_amount: 500, // $5
              currency: "usd",
              product_data: {
                name: "dish",
                description: "awesome dish!",
                images: ["https://mui.com/static/images/cards/paella.jpg"],
              },
            },
          },
        ],
      },
    })
    stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={1}
    >
      <Typography variant={"h4"}>Stripe Checkout</Typography>
      <Typography variant="subtitle1">
        Stripe Amount: {FOOD_AMOUNT * quantity}
      </Typography>

      <CheckoutCard />

      <Box display={"flex"} gap={3} alignItems={"center"} mt={2}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setQuantity((pre) => Math.max(0, --pre))}
          disabled={quantity === 0}
        >
          -
        </Button>
        <Typography width={20} textAlign={"center"}>
          {quantity}
        </Typography>
        <Button variant="contained" onClick={() => setQuantity((pre) => ++pre)}>
          +
        </Button>
      </Box>

      <Divider />

      <Button
        endIcon={<ShoppingBag fontSize={"large"} />}
        disabled={!quantity}
        variant="contained"
        color="success"
        onClick={onCheckout}
      >
        Start Checkout
      </Button>
    </Box>
  )
}

function CheckoutCard() {
  return (
    <Card sx={{ maxWidth: 345, mt: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            S
          </Avatar>
        }
        title="dish"
        subheader="awesome dish!"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://mui.com/static/images/cards/paella.jpg"
        alt="Paella dish"
      />
    </Card>
  )
}

export default Checkout
