export const download = (url, fileName) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
}

export function debounce(fn, ms = 0) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}
