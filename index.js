const UPSTREAM_HOST = "23.94.151.110";
const UPSTREAM_PORT = "80";  // NPM 的 HTTP 端口

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 构造目标 URL - 使用 HTTP 直连
    const targetUrl = `http://${UPSTREAM_HOST}:${UPSTREAM_PORT}${url.pathname}${url.search}`;
    
    // 复制并修改请求头
    const headers = new Headers(request.headers);
    
    // 设置正确的 Host 头（让 NPM 识别）
    headers.set('Host', 'xysxd.duckdns.org');
    
    // 添加真实访客 IP
    headers.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
    headers.set('X-Forwarded-Proto', 'https');
    headers.set('X-Forwarded-Host', url.hostname);
    
    // 创建新请求
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual'
    });
    
    try {
      // 转发请求
      const response = await fetch(newRequest);
      
      // 创建新响应
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      // 删除可能导致问题的响应头
      newResponse.headers.delete('Content-Security-Policy');
      newResponse.headers.delete('X-Frame-Options');
      
      // 添加 CORS 头（如果需要）
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      return newResponse;
      
    } catch (error) {
      // 错误处理
      return new Response(`代理错误: ${error.message}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  }
};
