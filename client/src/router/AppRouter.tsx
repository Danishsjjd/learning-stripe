import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../page"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
