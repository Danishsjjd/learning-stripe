import { auth } from "../config/firebase"

const Home = () => {
  return (
    <div className="pt-5">
      Hello 👋, {auth.currentUser?.displayName || auth.currentUser?.email}
    </div>
  )
}

export default Home
