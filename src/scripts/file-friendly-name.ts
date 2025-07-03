function fileFriendlyName(str: string) {
  return str.replace(/[\\/:*?"<>|]/g, '_');
}
