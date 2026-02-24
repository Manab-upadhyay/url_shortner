function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getMonth(),
  };
}
export default getCurrentMonthYear;
