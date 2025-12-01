/**
 * Chrome SNI Fix Script
 * Fixes 502 Bad Gateway by fronting SNI as g.cn while keeping Host header.
 */
var target_sni = "g.cn";
var url = $request.url;
var headers = $request.headers;
var original_host = headers['Host'] || headers['host'];
var regex = /^(https?:\/\/)(?:[^\/]+)(.*)$/;
var match = url.match(regex);

if (match) {
    var protocol = match[1];
    var path = match[2] || "/";
    var new_url = protocol + target_sni + path;
    var new_headers = JSON.parse(JSON.stringify(headers));
    
    // Fix headers
    if (original_host) {
        if (new_headers['host']) delete new_headers['host'];
        if (new_headers['Host']) delete new_headers['Host'];
        new_headers['Host'] = original_host;
    }
    
    console.log("[SNI-Fix] Rewriting SNI to g.cn");
    
    $done({
        url: new_url,
        headers: new_headers
    });
} else {
    $done({});
}
