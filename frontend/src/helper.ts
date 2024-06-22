export const Balance = (amt: number = 0) => {
  const res = amt / 100;
  return res.toFixed(2);
};
