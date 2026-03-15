const fs = require('fs');
const path = require('path');

const dir1 = 'i:/jp/code/ouyi-sites-gemini/ouyipc.com/src/content';
const dir2 = 'i:/jp/code/ouyi-sites-gemini/okxpc.com/src/content';

let totalFiles = 0;
let modifiedFiles = 0;
let unmodifiedFiles = [];

function checkSimilarity(content1, content2) {
    if (content1 === content2) return true;
    
    // Check if the only difference is 欧易 vs OKX
    const content1WithOKX = content1.replace(/欧易/g, 'OKX');
    if (content1WithOKX === content2) return true;
    
    // Basic similarity check based on length
    const len1 = content1.length;
    const len2 = content2.length;
    
    // If the texts are more than 95% similar in length after replacing brand names, they might just be simple replacements
    if (len1 > 0 && len2 > 0) {
        const diffRatio = Math.abs(len1 - len2) / Math.max(len1, len2);
        if (diffRatio < 0.05) {
             return 'highly_similar';
        }
    }
    
    return false;
}

function processDir(relPath) {
    const fullPath1 = path.join(dir1, relPath);
    const fullPath2 = path.join(dir2, relPath);
    
    if (!fs.existsSync(fullPath1) || !fs.existsSync(fullPath2)) return;

    if (fs.statSync(fullPath1).isDirectory()) {
        const files = fs.readdirSync(fullPath1);
        for (const file of files) {
            processDir(path.join(relPath, file));
        }
    } else if (fullPath1.endsWith('.json')) {
        totalFiles++;
        try {
            const c1 = fs.readFileSync(fullPath1, 'utf8');
            const c2 = fs.readFileSync(fullPath2, 'utf8');
            
            const isSame = checkSimilarity(c1, c2);
            if (isSame === true) {
                unmodifiedFiles.push({path: relPath, reason: 'identical_or_only_brand_change'});
            } else if (isSame === 'highly_similar') {
                unmodifiedFiles.push({path: relPath, reason: 'highly_similar_length'});
            } else {
                modifiedFiles++;
            }
        } catch(e) {}
    }
}

processDir('');

console.log('Total files checked: ');
console.log('Substantially modified files: ');
console.log('\nFiles that might need more SEO rewriting:');
unmodifiedFiles.forEach(f => console.log('- ' + f.file));
