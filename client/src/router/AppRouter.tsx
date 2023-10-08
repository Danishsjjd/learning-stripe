import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../page/Home"
import Header from "../components/Header"
import Checkout from "../page/Checkout"
import Success from "../page/Success"
import Failure from "../page/Failure"
import Payment from "../page/Payment"
import Customers from "../page/Customers"
import Subscriptions from "../page/Subscriptions"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Home />} path="/home" />
          <Route element={<Checkout />} path="/checkout" />
          <Route element={<Success />} path="/success" />
          <Route element={<Failure />} path="/failed" />
          <Route element={<Payment />} path="/payment" />
          <Route element={<Customers />} path="/customers" />
          <Route element={<Subscriptions />} path="/subscriptions" />
        </Routes>
      </Header>
    </BrowserRouter>
  )
}

export default AppRouter
