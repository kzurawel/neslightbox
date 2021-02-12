function getFileName (path) {
  let parts = path.split('/');
  parts = parts[parts.length - 1].split('\\');
  return parts[parts.length - 1];
}
exports.getFileName = getFileName;
