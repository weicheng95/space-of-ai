import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
	CLOUDFLARE_R2_ACCESS_KEY_ID,
	CLOUDFLARE_R2_ACCOUNT_ID,
	CLOUDFLARE_R2_SECRET_ACCESS_KEY
} from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID || '',
		secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
	}
});

const slugifyString = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\./g, '-')
		.replace(/-+/g, '-')
		.replace(/[^a-z0-9-]/g, '-');
};

const uploadPresignedUrl = async (
	name: string,
	ext: string,
	bucketName: string,
	filePath?: string
) => {
	// path = images/{date}-{slug}.{ext}
	const fileType = ext === '.svg' ? 'image/svg+xml' : 'image/webp';
	const fileExt = ext === '.svg' ? '.svg' : '.webp';
	const objectKey = `${filePath ? `${filePath}/` : ''}${slugifyString(Date.now().toString())}-${slugifyString(name)}${fileExt}`;
	console.log({ objectKey });
	const presignedUrl = await getSignedUrl(
		S3,
		new PutObjectCommand({
			Bucket: bucketName,
			Key: objectKey,
			ContentType: fileType,
			ACL: 'public-read'
		}),
		{
			expiresIn: 60 * 5 // 5 minutes
		}
	);

	return { presignedUrl, objectKey };
};

export const uploadImage = async (
	file: File,
	name: string,
	ext: string,
	bucketName: string,
	filePath?: string
) => {
	const { presignedUrl, objectKey } = await uploadPresignedUrl(name, ext, bucketName, filePath);

	const uploadToR2Response = await fetch(presignedUrl, {
		method: 'PUT',
		body: file
	});

	if (uploadToR2Response.ok) {
		return {
			status: 'success',
			key: objectKey
		};
	} else {
		return {
			status: 'success',
			message: await uploadToR2Response.text()
		};
	}
};
