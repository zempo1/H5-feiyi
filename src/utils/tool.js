
// utils/debouncePromise.js
export function debouncePromise(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    return new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const res = await fn.apply(this, args);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
  };
}