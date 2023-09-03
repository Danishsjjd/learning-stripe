const baseUrl = "http://localhost:3000/"

export default async function fetchFromAPI({
  uri,
  body,
  headers,
  method = "post",
  ...props
}: Omit<RequestInit, "body"> & {
  uri: string
  body: Record<string, any>
}) {
  return fetch(baseUrl + uri, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
      ...(headers ? headers : {}),
    },
    ...props,
  }).then((res) => {
    if (res.ok) return res.json()
    throw res.json().then((e) => e)
  })
}
