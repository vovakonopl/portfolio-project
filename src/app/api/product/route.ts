import { uploadProductScheme } from '@/scripts/validation-schemes/product-upload/product-upload-scheme';
import { auth } from '@clerk/nextjs/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { userId: sellerId } = await auth();

  if (sellerId) {
    return new Response('User not logged in', { status: 403 });
  }

  const requestData = await req.formData();
  const formData = uploadProductScheme.safeParse(requestData);

  if (!formData.success) {
    return new Response(`Error occurred:${formData.error.message}`, {
      status: 403,
    });
  }

  const productData = formData.data;

  // add all images to bucket
  const bucketPath: string = './image-bucket';

  // store images inside 1 folder per product
  const imageGroup: string = crypto.randomUUID();
  const imageGroupPath: string = `${bucketPath}/${imageGroup}`;

  await fs.mkdir(imageGroupPath);

  let imageCount: number = 1;

  try {
    // WARNING: image is string => can cause en error. TEST
    for (const image in productData.images) {
      const imageExtName: string = path.extname(image);

      await fs.writeFile(
        `${imageGroupPath}/${++imageCount}.${imageExtName}`,
        image,
      );
    }
  } catch {
    await fs.rmdir(imageGroupPath);

    return new Response('Error occurred on the server', { status: 500 });
  }

  const imagePaths: Array<string> = productData.images.map(
    (image: File, i: number) => {
      const imageExtName: string = path.extname(image.name);
      const imagePath: string = `${imageGroupPath}/${i + 1}/${imageExtName}`;

      return imagePath;
    },
  );
  // TODO: create a Poduct in db
}

export async function PATCH(req: Request) {
  const { userId: sellerId } = await auth();

  if (sellerId) {
    return new Response('User not logged in', { status: 403 });
  }
}
