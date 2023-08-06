import alea from 'alea';

export const normalDistPdf = (mean, std) => {
  return (x) => {
    return (
      (1 / (std * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * ((x - mean) / std) ** 2)
    );
  };
};

const normalDistSample = (mean = 0, stdev = 1, rnd) => {
  let u = 1 - rnd(); //Converting [0,1) to (0,1)
  let v = rnd();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
};

export const normalDist = (mean = 0, std = 1, seed = 'wu5m2z5np61') => {
  const rnd = alea(seed);
  return () => {
    return normalDistSample(mean, std, rnd);
  };
};
