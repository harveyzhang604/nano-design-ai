const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(localPath, r2Key) {
  const fileBuffer = fs.readFileSync(localPath);
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: 'image/jpeg',
  });

  await r2Client.send(command);
  console.log(`✅ 上传成功: ${r2Key}`);
  return `https://img.talkphoto.app/${r2Key}`;
}

async function main() {
  const files = [
    'outfit-change.jpg',
    'object-remove.jpg',
    'beauty-enhance.jpg',
    'style-transfer-pro.jpg'
  ];

  for (const file of files) {
    const localPath = `./public/examples/${file}`;
    const r2Key = `examples/${file}`;
    await uploadFile(localPath, r2Key);
  }
  
  console.log('\n所有图片上传完成！');
}

main().catch(console.error);
