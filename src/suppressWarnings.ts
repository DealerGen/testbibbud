const originalConsoleError = console.error;

console.error = function(...args) {
  if (typeof args[0] === 'string' && args[0].includes('Warning: %s: Support for defaultProps will be removed from memo components')) {
    return;
  }
  originalConsoleError.apply(console, args);
};