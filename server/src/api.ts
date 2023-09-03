import express from "express"
import cors from "cors"
import createStripeCheckoutSession from "./checkout"

const app = express()

app.use(express.json())
app.use(cors())

app.post("/checkout", async ({ body }, res) =>
  res.send(await createStripeCheckoutSession(body.line_items))
)

export { app }
