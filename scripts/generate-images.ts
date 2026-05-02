#!/usr/bin/env tsx
/**
 * 华夏志 — AI 图片批量生成脚本
 * 使用火山引擎方舟平台 Seedream 4.5 模型
 *
 * 使用方法:
 *   export VOLCENGINE_ARK_API_KEY="ark-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *   npm run generate-images
 */

import { quickGenerateImage, IMAGE_SIZE_2K } from '../lib/volcengine-ark';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(__dirname, '../public/images');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 首屏 Hero 大图
const heroImages = [
  {
    name: 'hero-master',
    ratio: '21:9' as const,
    prompt: '超宽画幅电影级场景，中华文明五千年历史长河，画面从右至左依次展现：夏商周的青铜鼎与甲骨文、秦汉的长城与兵马俑、隋唐的长安城与丝绸之路骆驼商队、宋代的汴京繁华市井、明清的紫禁城与万里长城，所有元素融入一幅超长的中国山水画卷中，金色时光河流贯穿全画，从远古流向近代，云雾缭绕，大气磅礴，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清细节，电影灯光',
  },
  { name: 'hero-xia', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，夏朝晚期都城二里头遗址复原，早期宫殿建筑群在黄河流域平原上，夯土台基、茅草屋顶，远处黄河蜿蜒流淌，青铜器作坊冒着青烟，先民穿着麻布衣裳在田间劳作，陶盉与爵等早期青铜礼器点缀其间，黄昏金色光线，薄雾笼罩，古朴苍茫感，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-shang', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，商朝晚期都城殷墟复原全景，宏伟的宫殿宗庙建筑群，夯土高台，重檐庑殿顶，广场中央矗立着巨大的后母戊鼎，祭祀场景中篝火熊熊，甲骨文占卜的巫师身影，青铜觚爵罍等礼器陈列，远处太行山脉，天色阴沉厚重，青铜器的青绿色锈迹色调主导画面，中国传统工笔画与影视级CG融合风格，暗调背景，神秘庄严，8K超高清' },
  { name: 'hero-zhou', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，西周镐京都城复原，规整的宗法礼制建筑群，宽阔的礼仪广场，列鼎制度的青铜礼器阵列，编钟悬挂于钟架之上，诸侯朝觐的车马队伍沿着宽阔大道驶入都城，背景是关中平原与渭河，柳树成行，春意盎然，画面色调温暖庄重，礼乐文明的秩序感，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-qin', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，秦朝咸阳宫复原全景，宏大的宫殿群沿渭河两岸展开，规整对称，法度森严，中央是巍峨的章台宫，远处隐约可见长城蜿蜒于山脊，兵马俑军阵整齐排列，黑色玄旗飘扬，驰道上奔驰的驿马车，统一度量衡的青铜标准器，画面色调以黑红为主，庄重肃杀，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-han', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，西汉长安城复原全景，恢弘的未央宫与长乐宫，宽阔的直城门大街，张骞出使西域的驼队从城门出发向西远行，丝绸之路上各国商旅往来，胡商、汉服、西域服饰交织，远处祁连雪山与大漠戈壁，天空辽阔，画面色调暖金与赭石，雄浑开阔，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-sanguo', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，三国时代经典意象融合，左侧：赤壁之战，火光照耀江面，战船相连，烈焰冲天，中央：铜雀台高耸，曹操横槊赋诗，右侧：茅庐竹林，诸葛亮羽扇纶巾，背景是分裂的中原大地，长江天堑，烽烟四起，画面充满戏剧张力，英雄主义的悲壮感，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-tang', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，盛唐时期长安城复原全景，宏伟的大明宫含元殿，丹凤门巍峨壮观，朱雀大街上车水马龙，各国使节、胡商、僧侣穿梭，大雁塔矗立城南，曲江池畔文人雅集，远处终南山云雾缭绕，金色夕阳洒满全城，画面色调暖金辉煌，盛唐气象的雍容华贵，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-song', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，北宋汴京开封城复原全景，《清明上河图》风格但影视级CG质感，汴河两岸商铺林立，虹桥上车马人流如织，勾栏瓦舍中杂剧表演，书院中士子读书，远处皇宫大内，近处市井烟火，画面色调天青淡雅，宋式美学的极简与精致，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-ming', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，明朝永乐年间北京城复原全景，紫禁城刚建成的宏伟全貌，太庙、社稷坛对称布局，永乐大典编纂场景，郑和宝船队在通州运河整装待发，万里长城在北部山脊蜿蜒，天坛祈年殿 blue-glazed 屋顶，画面色调赭石与明黄，庄严大气，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
  { name: 'hero-qing', ratio: '21:9' as const, prompt: '超宽画幅电影级场景，清朝乾隆年间北京城复原全景，完整的紫禁城全貌，圆明园西洋楼与中式园林并存，颐和园昆明湖与万寿山，京剧戏台上演出的热闹场景，四库全书编纂，江南织造府运来的丝绸，远处长城与山海关，疆域辽阔，画面色调华丽繁复，盛世的最后荣光，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感，8K超高清' },
];

// 事件场景图
const eventImages = [
  { name: 'event-unify', ratio: '16:9' as const, prompt: '电影级场景，秦始皇登基称帝的宏大仪式，咸阳宫中，始皇帝身穿黑色龙袍，头戴冕旒，殿下跪拜的六国降臣，殿外是统一的文字与度量衡标准器，背景是刚刚连接起来的万里长城，画面色调黑红庄重，法度森严，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感' },
  { name: 'event-zhangqian', ratio: '16:9' as const, prompt: '电影级场景，张骞率领使团穿越河西走廊，驼队在夕阳下的沙漠中前行，驼铃声声，远处是敦煌莫高窟的雏形，祁连雪山在天际线闪耀，张骞手持汉节，目光坚定望向西方，画面色调暖金苍凉，开拓者的孤独与坚毅，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感' },
  { name: 'event-chibi', ratio: '16:9' as const, prompt: '电影级战争场景，赤壁之战的夜晚，江面上战船被烈火吞噬，火光映红夜空，曹操水军大乱，东风吹拂，火势蔓延，远处周瑜、诸葛亮在高处观战，羽扇轻摇，画面充满戏剧性的火红与暗蓝对比，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感' },
  { name: 'event-xuanzang', ratio: '16:9' as const, prompt: '电影级场景，玄奘法师独自穿越戈壁沙漠，烈日当空，沙丘起伏，法师牵着瘦马艰难前行，远处天山雪峰，近处枯骨与 abandoned 烽燧，法师背负经笈，目光坚毅望向远方，画面色调金黄炙热，信仰的力量，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感' },
  { name: 'event-zhenghe', ratio: '16:9' as const, prompt: '电影级场景，郑和宝船队从刘家港出发，巨大的宝船桅杆林立，帆影如云，船队浩荡驶向印度洋，海豚在船边跳跃，郑和站在旗舰船头，手持罗盘，望向南方，画面色调蔚蓝壮阔，海洋文明的豪迈，中国传统工笔画与影视级CG融合风格，暗调背景，史诗感' },
];

// 人物肖像图
const figureImages = [
  { name: 'figure-qinshihuang', ratio: '3:4' as const, prompt: '中国秦朝帝王肖像，秦始皇嬴政，面部特征：高鼻梁、深眼窝、威严庄重，黑色冕服，头戴冕旒，手持玉圭，背景是咸阳宫剪影，中国传统工笔人物画与影视级CG融合风格，暗调背景，半身像' },
  { name: 'figure-libai', ratio: '3:4' as const, prompt: '中国唐朝诗人肖像，李白，面部特征：面容俊朗、目光豪放，白色长袍，手持酒壶，腰佩长剑，背景是长江三峡与明月，中国传统工笔人物画与影视级CG融合风格，暗调背景，半身像' },
  { name: 'figure-zhugeliang', ratio: '3:4' as const, prompt: '中国三国时期政治家肖像，诸葛亮，面部特征：面容清癯、目光深邃，羽扇纶巾，身着鹤氅，手持白羽扇，背景是五丈原与星空，中国传统工笔人物画与影视级CG融合风格，暗调背景，半身像' },
];

async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), Buffer.from(buffer));
  console.log(`✅ Saved: ${filename}`);
}

async function generateImage(item: { name: string; ratio: '21:9' | '16:9' | '3:4'; prompt: string }): Promise<void> {
  const filename = `${item.name}.jpg`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`⏭️ Skip (exists): ${filename}`);
    return;
  }

  try {
    console.log(`🎨 Generating: ${filename} (${item.ratio})`);
    const { images } = await quickGenerateImage(item.prompt, item.ratio);
    if (images[0]?.url) {
      await downloadImage(images[0].url, filename);
    } else {
      console.error(`❌ No image URL returned for ${filename}`);
    }
  } catch (error: any) {
    console.error(`❌ Failed ${filename}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 华夏志 — AI 图片批量生成\n');

  const allImages = [...heroImages, ...eventImages, ...figureImages];

  // 串行生成，避免速率限制
  for (const item of allImages) {
    await generateImage(item);
    // 延迟 1 秒避免触发速率限制
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('\n✨ 全部完成！');
}

main().catch(console.error);
