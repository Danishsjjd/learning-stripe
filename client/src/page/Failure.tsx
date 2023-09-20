import { useSearchParams } from "react-router-dom"

const Failure = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")

  return <div>Failure session id: {sessionId}</div>
}

export default Failure
