// AI Written Code 

// --- 性能优化：将匹配列表定义为常量 ---
// 1. 精确匹配列表 (使用 Set 实现 O(1) 查找速度)
const EXACT_HOSTS = new Set([
    'google', 
    'i.ytimg.com'
]);

// 2. 通配符/后缀匹配列表 (*.domain.com 和 domain.com)
const SUFFIXES_TO_MAP = [
    'youtube.com', 
    'ggpht.com'
];
// 目标域名
const NEW_HOST = 'g.cn';

// --- 脚本主函数 ---
function main(context) {
    const originalHost = context.targetHost;
    
    if (!originalHost) {
        return context;
    }

    // 域名本身是大小写不敏感的，一次性转换为小写
    const host = originalHost.toLowerCase();
    
    let shouldRewrite = false;

    // A. 检查精确匹配 (O(1) 查找)
    if (EXACT_HOSTS.has(host)) {
        shouldRewrite = true;
    } 
    
    // B. 检查后缀/通配符匹配 (效率优化后的查找)
    if (!shouldRewrite) {
        for (const suffix of SUFFIXES_TO_MAP) {
            // 匹配 *.domain.com (host.endsWith('.domain.com')) 
            // 或 domain.com (host === 'domain.com')
            if (host === suffix || host.endsWith('.' + suffix)) {
                shouldRewrite = true;
                break; // 匹配成功后立即退出循环
            }
        }
    }
    
    // 如果需要重写，则修改连接目标主机名 (同时修改了 SNI)
    if (shouldRewrite) {
        // **关键步骤：修改目标主机名/SNI**
        context.targetHost = NEW_HOST; 
        
        // 打印日志以方便调试
        console.log(`[HostRewrite] Rewritten connection target from ${originalHost} to ${NEW_HOST}`);
    }

    return context;
}
