import * as z from 'zod';
import { getSafeExternalUrl } from './utils';

const defaultSubmitValidationMessages = {
  nameRequired: 'Name is required',
  urlRequired: 'URL is required',
  urlInvalid: 'Invalid URL',
  taglineRequired: 'Tagline is required',
  descriptionRequired: 'Description is required',
  logoRequired: 'Logo is required',
  thumbnailRequired: 'Thumbnail is required',
  categoriesRequired: 'Select at least one category',
};

export function createSubmitSchema(
  messages: Partial<typeof defaultSubmitValidationMessages> = {}
) {
  const m = { ...defaultSubmitValidationMessages, ...messages };

  return z.object({
    name: z.string().min(1, m.nameRequired).max(100),
    url: z
      .string()
      .min(1, m.urlRequired)
      .refine((value) => !!getSafeExternalUrl(value), m.urlInvalid),
    tagline: z.string().min(1, m.taglineRequired).max(200),
    description: z.string().min(1, m.descriptionRequired).max(2000),
    logoUrl: z.string().min(1, m.logoRequired),
    thumbnailUrl: z.string().min(1, m.thumbnailRequired),
    pricingModel: z.enum(['Free', 'Paid']),
    categories: z.array(z.string()).min(1, m.categoriesRequired),
    discountCode: z.string().optional().or(z.literal('')),
  });
}

export const SubmitSchema = createSubmitSchema();

export type SubmitFormData = z.infer<typeof SubmitSchema>;
