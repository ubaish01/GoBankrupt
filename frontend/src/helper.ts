export const Balance = (amt: number = 0) => {
  const res = amt / 100;
  return res.toFixed(2);
};

export const generateRandomNumber = (min: number = 0, max: number = 10) => {
  const number = Math.floor(Math.random() * (max - min + 1));
  return number + min;
};
