// 注意：确保这一行只包含半角字符和英文引号
const UPSTREAM_URL = "http://23.94.151.110:81";

// 使用标准的 Worker 模块导出格式：export default { fetch }
export default {
  async fetch(request, env, ctx) { // 这里的 env 和 ctx 参数可以保留
    const url = new URL(request.url);
    
    // 构造新的 URL
    const newUrl = new URL(url.pathname + url.search, UPSTREAM_URL);
    
    // 创建新的请求对象
    const newRequest = new Request(newUrl, request);
    
    // 转发请求并返回响应
    return fetch(newRequest);
  }
};
