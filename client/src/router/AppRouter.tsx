import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../page/Home"
import Header from "../components/Header"
import Checkout from "../page/Checkout"
import Success from "../page/Success"
import Failure from "../page/Failure"
import Payment from "../page/Payment"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Checkout />} path="/checkout" />
          <Route element={<Success />} path="/success" />
          <Route element={<Failure />} path="/failed" />
          <Route element={<Payment />} path="/payment" />
        </Routes>
      </Header>
    </BrowserRouter>
  )
}

export default AppRouter
