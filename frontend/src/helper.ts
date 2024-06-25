export const Balance = (amt: number = 0) => {
  const res = amt / 100;
  return res.toFixed(2);
};

export const generateRandomNumber = (min: number = 0, max: number = 10) => {
  const number = Math.floor(Math.random() * (max - min + 1));
  return number + min;
};

export const formatNumber = (amount: number) => {
  if (amount >= 1000000000)
    return ` ${(amount / 1000000000).toFixed(2)} Billion`;
  if (amount >= 1000000) return ` ${(amount / 100000000).toFixed(2)} Million`;
  if (amount >= 1000) return ` ${(amount / 1000).toFixed(2)} K`;
  return `${amount?.toFixed(2)}`;
};

export const formatBalance = (amount: number) => {
  const numString = Math.floor(amount / 100).toString();
  let res = "";
  for (let i = 0; i < numString.length; i++) {
    if (i % 3 == 0 && i != 0) res = "," + res;
    const j = numString.length - i - 1;
    res = [numString[j]] + res;
  }
  return res + "." + (amount / 100).toFixed(2).toString()?.split(".")?.[1];
};

// 1,000,000
