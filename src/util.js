export const promisify = (cb) => new Promise((res, rej) => cb(res, rej));

export const isPromise = (p) => 'then' in p;

export function* range(start, end, step = 1) {
  let current = start;
  while (current <= end) {
    yield current;
    current += step;
  }
}
