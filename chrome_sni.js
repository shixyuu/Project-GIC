/**
 * Chrome SNI Fix (Local Version)
 * Fixes 502 Bad Gateway by fronting SNI as g.cn
 */

// 1. 定义目标 SNI
var target_sni = "g.cn";

// 2. 获取当前 URL 和 Headers
var url = $request.url;
var headers = $request.headers;

// 3. 提取原始 Host (解决 502 的关键)
// 兼容大小写，因为 HTTP/2 headers 通常是小写
var original_host = headers['Host'] || headers['host'];

// 4. 正则匹配：提取 https:// + 路径
var regex = /^(https?:\/\/)(?:[^\/]+)(.*)$/;
var match = url.match(regex);

if (match) {
    var protocol = match[1];
    var path = match[2] || "/";
    
    // 构造新 URL：协议 + g.cn + 路径
    var new_url = protocol + target_sni + path;
    
    // 5. 复制并修复 Headers
    // 我们必须保留原始 Host，否则服务器会拒绝请求
    var new_headers = JSON.parse(JSON.stringify(headers));
    
    if (original_host) {
        // 删除可能存在的不同大小写的 Host 键
        if (new_headers['host']) delete new_headers['host'];
        if (new_headers['Host']) delete new_headers['Host'];
        // 强制写回原始 Host
        new_headers['Host'] = original_host;
    }
    
    console.log("[SNI-Fix] Rewrite: " + new_url);
    
    // 6. 结束并返回
    $done({
        url: new_url,
        headers: new_headers
    });
} else {
    // 没匹配到，原样放行
    $done({});
}
