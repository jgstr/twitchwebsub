export const createConsoleReporter = () => {
  return {
    report: (message) => console.log(message),
  };
};
