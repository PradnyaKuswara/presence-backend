import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly endpoint?: string;
  private readonly publicUrl?: string;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    this.bucket = (
      process.env.S3_BUCKET ||
      process.env.AWS_S3_BUCKET ||
      ''
    ).trim();
    this.region = (
      process.env.S3_REGION ||
      process.env.AWS_REGION ||
      process.env.AWS_S3_REGION ||
      'us-east-1'
    ).trim();
    this.endpoint = (
      process.env.S3_ENDPOINT || process.env.AWS_S3_ENDPOINT
    )?.trim();
    this.publicUrl = (
      process.env.S3_PUBLIC_URL ||
      process.env.AWS_S3_PUBLIC_URL ||
      process.env.AWS_S3_PUBLIC_BASE_URL
    )?.trim();

    const accessKeyId = (
      process.env.S3_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      ''
    ).trim();
    const secretAccessKey = (
      process.env.S3_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      ''
    ).trim();

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint || undefined,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
      forcePathStyle: Boolean(this.endpoint),
    });
  }

  /**
   * Upload a file buffer to S3 / Object Storage
   * @param file Express.Multer.File object
   * @param folder Destination folder (e.g. 'schools/logos')
   * @returns Public URL of the uploaded object
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const key = `${folder}/${filename}`.replace(/\/+/g, '/');

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(
        `Failed to upload file to S3: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }

    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
    }

    if (this.endpoint) {
      return `${this.endpoint.replace(/\/$/, '')}/${this.bucket}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Delete a file from S3 by key or URL
   * @param fileUrlOrKey File URL or S3 object key
   */
  async deleteFile(fileUrlOrKey?: string | null): Promise<void> {
    if (!fileUrlOrKey) return;

    let key = fileUrlOrKey;
    if (fileUrlOrKey.startsWith('http')) {
      try {
        const url = new URL(fileUrlOrKey);
        key = url.pathname.replace(/^\/+/, '');
        if (this.endpoint && key.startsWith(`${this.bucket}/`)) {
          key = key.replace(`${this.bucket}/`, '');
        }
      } catch {
        return;
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.warn(
        `Failed to delete file from S3: ${(error as Error).message}`,
      );
    }
  }
}
