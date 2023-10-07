import { Button, Input } from "@mui/material"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { ChangeEvent, useState } from "react"
import { auth } from "../config/firebase"

const Auth = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCredentials((pre) => ({ ...pre, [e.target.id]: e.target.value }))

  return (
    <div>
      <Input
        placeholder="Email"
        type="email"
        id="email"
        value={credentials.email}
        onChange={handleChange}
      />
      <Input
        placeholder="Password"
        type="password"
        id="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <Button
        onClick={() =>
          createUserWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
        }
      >
        sign up
      </Button>
      <Button
        onClick={() =>
          signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
        }
      >
        sign in
      </Button>
    </div>
  )
}

export default Auth
