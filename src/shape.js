export const drawBlurred = (drawFn, state, steps = 10) => {
  const increment = 1 / steps;
  for (let step = steps - 1; step >= 0; step--) {
    const t = 1 - step * increment;

    state.blurStep = step;
    state.blurSteps = steps;
    state.blur = t;

    drawFn(state);
  }
};
