import { S3 } from '@aws-sdk/client-s3';
import fs from "fs"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


const region = ""
const bucketName=""
const accessKeyId=""
const secretKeyId=""

const s3 = new S3({
    region,
    accessKeyId,
    secretKeyId
})

async function uploadFile(file,fileName) {
    const fileStream = fs.createReadStream(file.path);
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: fileName+".png"
    };
  
    const command = new PutObjectCommand(uploadParams); // PutObjectCommand nesnesi oluşturuldu

    return await s3.send(command);  
}
async function getFileStream(fileKey){
    const downloadParams = {
        Key : fileKey,
        Bucket : bucketName
    }
    const s3Object = await s3.getObject(downloadParams);
    return s3Object.Body;
}

export { uploadFile,getFileStream };

