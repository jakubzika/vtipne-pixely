export const normalDist = (mean, variance) => {
  return (x) => {
    return (
      (1 / (variance * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * ((x - mean) / variance) ** 2)
    );
  };
};
