const createNewSubscription = () => {
  return {
    hubUrl: '',
    subId: '',
    hubCallback: '',
    hubTopic: ''
  };
};

module.exports = { createNewSubscription };