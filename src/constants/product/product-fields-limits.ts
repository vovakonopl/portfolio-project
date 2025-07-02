export const PRODUCT_FIELDS_LIMITS = Object.freeze({
  option: Object.freeze({
    nameLength: 25,
  }),
  product: Object.freeze({
    nameLength: 200,
    descriptionLength: 1000,
    imageCount: 15,
  }),
  service: Object.freeze({
    nameLength: 50,
    descriptionLength: 500,
  }),
  maxPrice: 1000000, // 1 mil $
});
