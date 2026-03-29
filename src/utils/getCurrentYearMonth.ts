function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
  };
}
export default getCurrentMonthYear;
