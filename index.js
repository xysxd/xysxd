const UPSTREAM_URL = "http://23.94.151.110:8080"; 

export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  const newUrl = new URL(url.pathname + url.search, UPSTREAM_URL);
  const newRequest = new Request(newUrl, request);

  return fetch(newRequest);
}
