export const zodRegexEntry: [RegExp, { message: string }] = [
  /^[^\\/:*?"<>|]*$/,
  {
    message:
      "Contains invalid characters. (Invalid characters: '\\', '/', ':', '*', '?', '\"', '<', '>', '|'.)",
  },
];
