import * as AWS from "aws-sdk"

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET
    }
})

export const uploadToS3 = async (file: any, userId: number, folder: string) => {
    const { filename, createReadStream } = await file;
    const stream = createReadStream();
    const ObjName = `${folder}/${userId}-${Date.now()}-${filename}`;
    const { Location } = await new AWS.S3()
        .upload({
            Bucket: "instaclone-jiun-uploads",
            Key: ObjName,
            ACL: "public-read",
            Body: stream
        })
        .promise();
    return Location
}