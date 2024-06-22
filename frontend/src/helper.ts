export const Balance = (amt: number) => {
  const res = amt / 100;
  return res.toFixed(2);
};
