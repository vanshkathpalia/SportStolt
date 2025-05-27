export const formatDateToDDMMYYYY = (date: Date): string =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
});
  


