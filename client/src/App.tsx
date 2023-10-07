import { useEffect, useState } from "react"
import Routes from "./router/AppRouter"
import { onAuthStateChanged } from "firebase/auth"
import { auth, fireStore } from "./config/firebase"
import Auth from "./components/Auth"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"

export default function ButtonUsage() {
  const [foundUser, setFoundUser] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = collection(fireStore, "users")
        const docRef = doc(userRef, user.uid)
        const userDoc = await getDoc(docRef)

        if (userDoc.exists()) return setFoundUser(true)

        const {
          email,
          uid,
          displayName,
          emailVerified,
          photoURL,
          isAnonymous,
          phoneNumber,
          providerId,
        } = user
        setDoc(docRef, {
          email,
          uid,
          displayName,
          emailVerified,
          photoURL,
          isAnonymous,
          phoneNumber,
          providerId,
        })
        setFoundUser(true)
      } else {
        setFoundUser(false)
      }
    })
  }, [])

  if (!foundUser) return <Auth />
  else return <Routes />
}
