function formatDate(oldDate) {
  const date = new Date(oldDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  return `${(day < 10) ? '0' + day : day}-${ (month < 10) ? '0' + month : month }-${date.getFullYear()}`;
}

export { formatDate };