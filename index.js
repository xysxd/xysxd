const UPSTREAM_HOST = "23.94.151.110";
const UPSTREAM_PORT = "8080";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = `http://${UPSTREAM_HOST}:${UPSTREAM_PORT}${url.pathname}${url.search}`;
    
    const headers = new Headers(request.headers);
    headers.set('Host', url.hostname);
    
    const clientIP = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
    headers.set('X-Real-IP', clientIP);
    headers.set('X-Forwarded-For', clientIP);
    headers.set('X-Forwarded-Proto', 'https');
    
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      redirect: 'manual'
    });
    
    try {
      const response = await fetch(newRequest);
      const newHeaders = new Headers(response.headers);
      
      newHeaders.delete('Content-Security-Policy');
      newHeaders.delete('X-Frame-Options');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
      
    } catch (error) {
      return new Response(`连接错误: ${error.message}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  }
};
