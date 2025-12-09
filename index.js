const UPSTREAM_URL = "http://23.94.151.110:81"; 
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const newUrl = new URL(url.pathname + url.search, UPSTREAM_URL);
        const newRequest = new Request(newUrl, request);
        return fetch(newRequest);
    }
};
