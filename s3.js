import { S3 } from '@aws-sdk/client-s3';
import fs from "fs"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


const region = "eu-north-1"
const bucketName="amazon-image-upload-bucket"
const accessKeyId="AKIA2DAFBYFTGGY6AG3B"
const secretKeyId="Vu054nHxgyT0IE5OCWqutWP/2CTSzWzIbu4NTyAd"

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

