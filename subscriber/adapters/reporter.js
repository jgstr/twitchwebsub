export const createReporter = (config) => {
  // TODO: figure out the requirements for different configurations (ie. console, write-to-file, etc.)
  // Right now, console is just hardcoded.
  return {
    reportGetAllSubscriptions: (message) => console.log(message),
  };
};
