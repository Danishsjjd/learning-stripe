import { auth } from "../config/firebase"

const Home = () => {
  return <div>Hello 👋, {auth.currentUser?.email}</div>
}

export default Home
