import fs from 'fs/promises';
import path from 'path';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { productScheme } from '@/scripts/validation-schemes/product-upload/product-scheme';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('User not logged in', { status: 403 });
  }

  const requestData = await req.formData();
  const formData = productScheme.safeParse(requestData);

  if (!formData.success) {
    let errorMsg: string;
    if (formData.error.errors[0].code === 'custom') {
      errorMsg = 'Error in data handling occurred. Contact support.';
    } else {
      errorMsg = formData.error.message;
    }

    return new Response(`Error occurred:${errorMsg}`, {
      status: 403,
    });
  }

  const productData = formData.data;

  // =-=-=-=-=-=-=-=-=-= Store all images =-=-=-=-=-=-=-=-=-=
  const bucketPath: string = './image-bucket';

  // store images within a single folder for the whole product
  const imageGroupPath: string = `${bucketPath}/${crypto.randomUUID()}`;
  await fs.mkdir(imageGroupPath);

  // key - variant name, value - array of image paths
  const variantsImagePathsMap: Map<string, string[]> = new Map();
  // key - variant name, value - image path
  const servicesImagePathsMap: Map<string, string> = new Map();

  let imageCount: number = 0;
  try {
    // ---------------------- Product images ----------------------
    for (const variant of productData.variants.options.values()) {
      // if this is a single variant, store images in the root of the image group
      let variantImagesPath: string = imageGroupPath;
      if (productData.variants.options.size > 1) {
        // if it has other variants, create subfolders for each variant
        variantImagesPath = `${imageGroupPath}/${fileFriendlyName(variant.optionName)}`;
        await fs.mkdir(variantImagesPath);
      }

      for (const image of variant.images) {
        const imageExtName: string = path.extname(image.name);
        const imagePath: string = `${variantImagesPath}/${++imageCount}${imageExtName}`;
        const imageBuffer = await image.arrayBuffer();
        await fs.writeFile(imagePath, Buffer.from(imageBuffer));

        // Store the image in the map
        const variantName: string = fileFriendlyName(variant.optionName);
        const imagePathsArr: string[] | undefined =
          variantsImagePathsMap.get(variantName);
        if (imagePathsArr) {
          imagePathsArr.push(imagePath);
        } else {
          variantsImagePathsMap.set(variantName, [imagePath]);
        }
      }
    }

    // ---------------------- Service images ----------------------
    // store images for services in the root of the image group
    for (const service of productData.additionalServices.values()) {
      if (!service.image) continue;

      const imageExtName: string = path.extname(service.image.name);
      const imagePath: string = `${imageGroupPath}/${fileFriendlyName(
        service.name,
      )}${imageExtName}`;
      const imageBuffer = await service.image.arrayBuffer();
      await fs.writeFile(imagePath, Buffer.from(imageBuffer));

      // Store the image in the map
      servicesImagePathsMap.set(service.name, imagePath);
    }
  } catch {
    await fs.rmdir(imageGroupPath);

    return new Response(
      'Error occurred on the server: Could not store the images.',
      { status: 500 },
    );
  }

  // =-=-=-=-=-=-=-=-=-= Store product data in DB =-=-=-=-=-=-=-=-=-=
  const productVariants = Array.from(productData.variants.options.values());
  const mainVariant = productVariants[0];
  const otherVariants = productVariants.slice(1);
  let optionGroup: string | null = fileFriendlyName(productData.variants.name);
  let optionName: string | null = fileFriendlyName(mainVariant.optionName);
  if (productVariants.length === 1) {
    optionGroup = optionName = null;
  }

  const categoryId: string = productData.categoryId;
  const subCategoryId: string = productData.subCategoryId;

  const toCents = (price?: number): number => Math.floor((price || 0) * 100);

  const product = db.product.create({
    data: {
      sellerId: userId,
      name: mainVariant.name,
      priceInCents: toCents(mainVariant.price),
      description: mainVariant.description,
      imagePaths:
        variantsImagePathsMap.get(fileFriendlyName(mainVariant.optionName)) ||
        [],

      categoryId,
      subCategoryId,

      rating: 0,
      ratingNumber: 0,
      remainInStock: 0,

      // other variants if there are any
      optionGroup,
      optionName,
      variants: {
        create: otherVariants.map((variant) => ({
          name: variant.name,
          priceInCents: toCents(variant.price),
          description: variant.description,
          imagePaths:
            variantsImagePathsMap.get(fileFriendlyName(variant.optionName)) ||
            [],

          optionGroup: productData.variants.name,
          optionName: variant.optionName,

          categoryId,
          subCategoryId,
          remainInStock: 0,
        })),
      },

      // secondary options
      secondaryOptions: {
        create: Array.from(
          productData.secondaryOptions
            .entries()
            .flatMap(([optionGroup, options]) =>
              options.values().map((option) => ({
                name: option.name,
                priceInCents: toCents(option.price),
                optionGroup,
                optionName: option.displayedName,
              })),
            ),
        ),
      },

      // additional services
      additionalServices: {
        create: Array.from(productData.additionalServices.values()).map(
          (service) => ({
            name: service.name,
            priceInCents: toCents(service.price),
            description: service.description,
            imagePath: servicesImagePathsMap.get(service.name),
          }),
        ),
      },
    },
  });

  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();

  if (userId) {
    return new Response('User not logged in', { status: 403 });
  }
}
