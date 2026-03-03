// Cloudflare R2 存储配置
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// R2 配置（需要在环境变量中设置）
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-ai';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

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
 * 从 URL 下载图片并上传到 R2
 * @param imageUrl 原始图片 URL
 * @returns R2 公开访问 URL
 */
export async function saveImageToR2(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const key = `generations/${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'image/png',
  });

  await r2Client.send(command);

  // 返回公开访问 URL
  return `${R2_PUBLIC_URL}/${key}`;
}
