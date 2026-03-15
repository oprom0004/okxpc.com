
const LINK_MAP: Record<string, string> = {
  "OKX": "/jiaoyisuo",
  "OKX 电脑客户端": "/xiazai",
  "电脑客户端": "/xiazai",
  "桌面端": "/xiazai",
  "网页版入口": "/web",
  "APP 下载中心": "/app",
  "安卓": "/app/anzhuo",
  "苹果": "/app/ios",
  "Web3 钱包": "/qianbao",
  "Web3 节点": "/qianbao",
  "OKB 生态": "/okb",
  "技术教程": "/jiaochen",
  "安装向导": "/ouyi-pc-xiazai-anzhuang",
  "最新版本": "/ouyi-pc-xiazai-zuixinban",
  "官方网关": "/diannaoban-xiazai-guanwang",
};

/**
 * 自动为文案中的核心关键词添加内链
 * 策略：每种关键词在一段话内最多只锚点一次，避免过度优化
 */
export function injectInternalLinks(text: string): string {
  if (!text || typeof text !== 'string') return text;

  // 按照关键词长度倒序排列，防止“欧易电脑版”被拆解为“欧易”和“电脑版”
  const sortedKeywords = Object.keys(LINK_MAP).sort((a, b) => b.length - a.length);
  const usedKeywords = new Set<string>();

  let result = text;

  // 简单的正则替换，避免破坏已有的 HTML 标签
  // 这个正则比较基础，在复杂的 HTML 环境下可能需要更严谨的处理
  sortedKeywords.forEach(keyword => {
    if (usedKeywords.has(keyword)) return;

    // 匹配不再 <a> 标签内的关键词
    const regex = new RegExp(`(${keyword})(?![^<]*>|[^<>]*<\/a>)`, 'g');

    let count = 0;
    result = result.replace(regex, (match) => {
      // 每段内容同一种词只链一次
      if (count === 0) {
        count++;
        usedKeywords.add(keyword);
        return `<a href="${LINK_MAP[keyword]}" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">${match}</a>`;
      }
      return match;
    });
  });

  return result;
}
