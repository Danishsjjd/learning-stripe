import { auth } from "./config/firebase"

const baseUrl = "http://localhost:3333/"

export default async function fetchFromAPI({
  uri,
  body,
  headers,
  method = "post",
  ...props
}: Omit<RequestInit, "body"> & {
  uri: string
  body?: Record<string, unknown>
}) {
  const user = auth.currentUser
  const token = await user?.getIdToken()

  return fetch(baseUrl + uri, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(headers ? headers : {}),
    },
    ...props,
  }).then((res) => {
    if (res.ok) return res.json()
    throw res.json().then((e) => e)
  })
}
