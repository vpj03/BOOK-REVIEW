// Convert image filename to full URL
export const getImageUrl = (filename) => {
  if (!filename) return '';
  return `http://localhost:5000/api/images/${filename}`;
};
