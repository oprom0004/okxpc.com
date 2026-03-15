const fs = require('fs');
const path = require('path');

const dir = 'i:/jp/code/ouyi-sites-gemini/okxpc.com/src/content';

const replacements = [
    { regex: /\b(App Store)\b/gi, to: '应用商店' },
    { regex: /\b(Apple ID)\b/gi, to: '苹果账号' },
    { regex: /\b(Apple)\b/gi, to: '苹果' },
    { regex: /\b(Android)\b/gi, to: '安卓' },
    { regex: /\b(iOS)\b/gi, to: '苹果端' },
    { regex: /\b(App)\b/gi, to: '应用' },
    { regex: /\b(APP)\b/g, to: '应用' },
    { regex: /\b(APK)\b/gi, to: '安装包' },
    { regex: /\b(FAQ|Q&A|Q & A)\b/gi, to: '常见问题解答' },
    { regex: /\b(macOS)\b/gi, to: '苹果系统' },
    { regex: /\b(Windows)\b/gi, to: 'Windows系统' },
    { regex: /\b(PC)\b/gi, to: '电脑端' },
    { regex: /\b(Mac)\b/gi, to: '苹果系统端' },
    { regex: /\b(API)\b/gi, to: '数据接口' },
    { regex: /\b(DNS)\b/gi, to: '域名解析' },
    { regex: /\b(URL)\b/gi, to: '网址链接' },
    { regex: /\b(Layer 2|Layer2)\b/gi, to: '二层网络' },
    { regex: /\b(TestFlight)\b/gi, to: '苹果测试分发' },
    { regex: /\b(TradingView)\b/gi, to: '专业图表' },
    { regex: /\b(exe)\b/gi, to: '系统安装程序' },
    { regex: /\b(dmg)\b/gi, to: '苹果系统镜像' },
    { regex: /\b(POR)\b/gi, to: '储备金证明' },
    { regex: /\b(Native)\b/g, to: '原生' },
    { regex: /\b(Desktop)\b/gi, to: '桌面端' },
    { regex: /欧易/g, to: 'OKX' }
];

function replaceInString(str) {
    if (str.startsWith('/') || str.startsWith('http')) return str;
    let res = str;
    for (const r of replacements) {
        res = res.replace(r.regex, r.to);
    }
    return res;
}

function traverse(obj) {
    if (typeof obj === 'string') {
        return replaceInString(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(traverse);
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const k in obj) {
            newObj[k] = traverse(obj[k]);
        }
        return newObj;
    }
    return obj;
}

function processDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.json')) {
            const oldContent = fs.readFileSync(fullPath, 'utf8');
            let data;
            try {
                data = JSON.parse(oldContent);
            } catch (e) {
                continue;
            }
            const newData = traverse(data);
            const newContent = JSON.stringify(newData, null, 4) + '\n';
            if (oldContent !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    }
}

processDir(dir);
