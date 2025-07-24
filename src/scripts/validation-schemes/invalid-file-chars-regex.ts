export const zodInvalidFileCharsRegexEntry: [RegExp, { message: string }] = [
  /^[^\\/:*?"<>|]*$/,
  {
    message:
      "Contains invalid characters. (Invalid characters: '\\', '/', ':', '*', '?', '\"', '<', '>', '|'.)",
  },
];
