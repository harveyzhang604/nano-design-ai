const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCOUNT_ID = "9af2fdf271637c43b99ca8349ee04c59";
const R2_ACCESS_KEY_ID = "9874ce253894ad5af6efb022edec4908";
const R2_SECRET_ACCESS_KEY = "d4547155be0f4b1fad9cd7d2a37ba1246e2cbf08ba31721e0fd204073d196f39";
const R2_BUCKET_NAME = "nano-design-images";

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(localPath, r2Key) {
  console.log(`上传 ${r2Key}...`);
  const fileBuffer = fs.readFileSync(localPath);
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: 'image/jpeg',
  });

  await r2Client.send(command);
  console.log(`✅ ${r2Key} 上传成功`);
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
  
  console.log('\n✅ 所有图片上传完成！');
  console.log('访问地址: https://img.talkphoto.app/examples/');
}

main().catch(console.error);
