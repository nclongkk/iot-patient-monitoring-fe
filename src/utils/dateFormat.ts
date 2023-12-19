export const formatDate =(date: string) => {
  const convertDate = new Date(date);
  // add 7 hours to get the correct time
  const day = convertDate.getDate();
  const month = convertDate.getMonth() + 1;
  const year = convertDate.getFullYear();
  const hours = convertDate.getHours();
  const minutes = convertDate.getMinutes();
  const seconds = convertDate.getSeconds();
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}