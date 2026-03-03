// Cloudflare R2 存储模块
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// R2 配置
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '9af2fdf271637c43b99ca8349ee04c59';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '278c4116bd1714c15771b40312888121';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '91fe7fc08ca3e262e76d960a591950707a8d60b23ea247ebe3bfbbf8c7e0b2e4';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://img.scene2talk.com';

// 创建 S3 客户端（R2 兼容 S3 API）
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * 将 Base64 图片上传到 R2
 * @param base64Data Base64 编码的图片数据
 * @param prompt 用于生成文件名
 * @returns R2 公开访问 URL
 */
export async function uploadImageToR2(base64Data: string, prompt: string): Promise<string> {
  // 清理 base64 数据（去除 data:image/png;base64, 前缀）
  const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Content, 'base64');
  
  // 生成唯一文件名
  const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${Date.now()}-${sanitizedPrompt}.png`;
  const key = `images/${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/png',
  });

  await r2Client.send(command);

  // 返回公开访问 URL
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * 检查 R2 是否可用
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID ||
    process.env.R2_ACCESS_KEY_ID ||
    process.env.R2_SECRET_ACCESS_KEY
  );
}
