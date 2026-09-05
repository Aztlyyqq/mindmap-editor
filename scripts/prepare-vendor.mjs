// 从公共 CDN 获取指定版本 Vue 3 生产版单文件，写入 vendor/
// 用法：node scripts/prepare-vendor.mjs（npm install 后会通过 postinstall 自动执行）
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const VER = '3.4.38';
const OUT = join(root, 'vendor', 'vue.global.prod.min.js');
const SOURCES = [
  `https://unpkg.com/vue@${VER}/dist/vue.global.prod.js`,
  `https://cdn.jsdelivr.net/npm/vue@${VER}/dist/vue.global.prod.js`,
  `https://registry.npmmirror.com/vue/${VER}/files/dist/vue.global.prod.js`
];

for (const url of SOURCES) {
  try {
    console.log('尝试下载：', url);
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.toString('utf8').includes('var Vue=function')) throw new Error('内容不是 Vue 生产库');
    await mkdir(dirname(OUT), { recursive: true });
    await writeFile(OUT, buf);
    console.log('✓ 已生成 vendor/vue.global.prod.min.js，', buf.length, 'bytes');
    process.exit(0);
  } catch (e) {
    console.warn('× 失败：', e.message);
  }
}
console.error('所有下载源均失败，请检查网络后重试 node scripts/prepare-vendor.mjs');
process.exit(1);
