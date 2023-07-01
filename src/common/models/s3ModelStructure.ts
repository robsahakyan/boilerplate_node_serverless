import AWS from "aws-sdk";
import * as S3Dtos from "../dtos/s3Dtos";

AWS.config.update({ region: "eu-north-1" });
const s3 = new AWS.S3();

export class S3Model {
    bucketName: string;

    constructor(bucketName: string) {
        this.bucketName = bucketName;
    }

    async save(Key: string, Body: any, ContentType: string = "text/plain"): Promise<S3Dtos.GameTypeAfterInsertionToS3> {
        const params = {
            Bucket: this.bucketName,
            Key,
            Body,
            ContentType
        }

        return new Promise((res, rej) => {
            s3.upload(params, function(err: any, data: any) {
                if (err) {
                  console.error('Error uploading file:', err);
                  rej({ success: false, key: Key })
                } else {
                  console.log('Object uploaded successfully:', data.Location);
                  res({ success: true, url: data.Location, key: data.Key })
                }
              });
        })
    }

    async getObject(Key: string): Promise<any> {
        const params = {
            Bucket: this.bucketName,
            Key
        }
        return new Promise((res, rej) => {
            s3.getObject(params, (err, data: any) => {
                if (err) {
                    res({ success: false, message: `Error retrieving object:  ${err}`});
                } else {
                    res({ success: true, data: data.Body.toString()} );
                }
            });
        })
    }

    async deleteObjectFromBucket(Key: string): Promise<any> {
        const deleteParams = {
            Bucket: this.bucketName,
            Key
        };
    
        return new Promise((res, rej) => {
            s3.deleteObject(deleteParams, (error, data) => {
                if (error) {
                    console.error("Error deleting object",  error);
                    res({ success: false, message: "Error deleting object"});
                } else {
                    res({ success: false, message: `Object successfully deleted:  ${Key}`});
                }
            });
        })
    }
}