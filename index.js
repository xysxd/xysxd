const UPSTREAM_URL = "http://23.94.151.110:81";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 构造新的 URL
    const newUrl = new URL(url.pathname + url.search, UPSTREAM_URL);
    
    // 创建新的请求对象
    const newRequest = new Request(newUrl, request);
    
    // 转发请求并返回响应
    return fetch(newRequest);
  }
};
