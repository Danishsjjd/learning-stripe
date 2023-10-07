import { useEffect, useState } from "react"
import Routes from "./router/AppRouter"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./config/firebase"
import Auth from "./components/Auth"

export default function ButtonUsage() {
  const [foundUser, setFoundUser] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setFoundUser(true)
      } else {
        setFoundUser(false)
      }
    })
  }, [])

  if (!foundUser) return <Auth />
  else return <Routes />
}
