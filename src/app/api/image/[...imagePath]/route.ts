import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { IMAGE_BUCKET_FOLDER } from '@/constants/image-bucket-folder';

type TImageMIMETypes =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/svg+xml'
  | 'octet-stream';

function defineImageMIMEType(imagePath: string): TImageMIMETypes {
  const ext: string | undefined = imagePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';

    case 'png':
      return 'image/png';

    case 'webp':
      return 'image/webp';

    case 'svg':
      return 'image/svg+xml';

    default:
      return 'octet-stream';
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ imagePath: string[] }> },
) {
  const { imagePath } = await params;
  const path = imagePath.join('/');
  try {
    const imageBuffer: Buffer = await fs.readFile(
      `./${IMAGE_BUCKET_FOLDER}/${path}`,
    );
    const contentType: TImageMIMETypes = defineImageMIMEType(path);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
      },
    });
  } catch (err) {
    return new NextResponse('Image not found', { status: 404 });
  }
}
