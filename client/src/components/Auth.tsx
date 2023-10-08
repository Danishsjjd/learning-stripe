import { Google } from "@mui/icons-material"
import { Box, Button } from "@mui/material"
import { auth } from "../config/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
const Auth = () => {
  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button startIcon={<Google />} onClick={handleGoogleAuth}>
        Sign with google
      </Button>
    </Box>
  )
}

export default Auth
