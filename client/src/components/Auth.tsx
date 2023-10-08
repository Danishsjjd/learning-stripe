import { auth } from "../config/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
const Auth = () => {
  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
  }

  return (
    <main className="vh-100 w-100 d-flex align-items-center justify-content-center">
      <button className="btn btn-primary" onClick={handleGoogleAuth}>
        Sign with google
      </button>
    </main>
  )
}

export default Auth
