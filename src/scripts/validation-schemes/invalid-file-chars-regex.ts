export const zodRegexEntry: [RegExp, { message: string }] = [
  /[\\/:*?"<>|]/g,
  {
    message:
      "Contains invalid characters. (Invalid characters: '\\', '/', ':', '*', '?', '\"', '<', '>', '|'.)",
  },
];
