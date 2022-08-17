import {Req, Res, Injectable} from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import s3Storage = require("multer-sharp-s3");

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();

@Injectable()
export class FileUploadService {
  constructor() {
    
        try {
            if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
                AWS.config.update({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                });
            }
        } catch (error) {
            console.error(`Failed to set AWS Config ${error}`);
        }
    }

    async fileupload(@Req() req, @Res() res) {
        try {
            this.upload(req, res, function (error) {
                if (error) {
                    return res.status(404).json(`Failed to upload file: ${error}`);
                }
                return res.status(201).json(req.files[0].Location);
            });
        } catch (error) {
            return res.status(500).json(`Failed to upload  file: ${error}`);
        }
    }

  upload = multer({
            
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
                return cb(new Error('Please upload an image'))
            }

            cb(undefined, true)
        },
        storage: s3Storage({
            s3: s3,
            Bucket: AWS_S3_BUCKET_NAME,
            ACL: 'public-read',
            Key: function (_, file, cb) {
                cb(null, `${Date.now().toString()} - ${file.originalname}`);
            },
            resize: {
                width: 600,
                height: 400,
            },
        }),
          limits: {
            fileSize: 1000000
        },
    }).array('upload', 1);
}