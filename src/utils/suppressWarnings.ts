const originalConsoleError = console.error;

console.error = function(...args) {
  const warningMessage = args[0];
  
  if (typeof warningMessage === 'string') {
    // Suppress react-beautiful-dnd defaultProps warning
    if (warningMessage.includes('Support for defaultProps will be removed from memo components')) {
      return;
    }
  }
  
  originalConsoleError.apply(console, args);
};