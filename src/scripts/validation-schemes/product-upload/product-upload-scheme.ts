import { z } from 'zod';
import { productScheme } from '@/scripts/validation-schemes/product-upload/product-scheme';

// TODO: Move this scheme to the _utils folder.
//  It is required for ReactHookForm to specify which fields form has.
//  Replace it with scheme, which will validate groups of options and everything else
export const uploadProductScheme = productScheme.extend({
  category: z.string(),
  subcategory: z.string(),
});

export type TUploadProduct = z.infer<typeof uploadProductScheme>;
