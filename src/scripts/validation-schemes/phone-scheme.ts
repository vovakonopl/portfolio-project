import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';

export const phoneScheme = z.object({
  phoneNumber: z.string({ message: 'Must be a string.' }).refine((phone) => {
    const phoneNumber = parsePhoneNumberFromString(`+${phone}`);
    return phoneNumber?.isValid();
  }),
});

export type TPhone = z.infer<typeof phoneScheme>;
