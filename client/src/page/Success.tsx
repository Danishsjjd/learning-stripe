import { useSearchParams } from "react-router-dom"

const Success = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  return <div>Success session id: {sessionId}</div>
}

export default Success
