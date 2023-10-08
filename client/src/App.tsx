import { useEffect, useReducer } from "react"
import Routes from "./router/AppRouter"
import { onAuthStateChanged } from "firebase/auth"
import { auth, fireStore } from "./config/firebase"
import Auth from "./components/Auth"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"

type Store = {
  loading: boolean
  foundUser: boolean
}

export default function App() {
  const [{ foundUser, loading }, dispatch] = useReducer<
    (pre: Store, next: boolean) => Store
  >(
    (_, next) => {
      return { loading: false, foundUser: next }
    },
    { loading: true, foundUser: false }
  )

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = collection(fireStore, "users")
        const docRef = doc(userRef, user.uid)
        const userDoc = await getDoc(docRef)

        if (userDoc.exists()) return dispatch(true)

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
        dispatch(true)
      } else {
        dispatch(false)
      }
    })
  }, [])

  if (loading) return <>bro sit back while we are fetching your details</>
  else if (!foundUser) return <Auth />
  else return <Routes />
}
