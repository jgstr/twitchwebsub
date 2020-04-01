const subscriptionDummy = {
    hubUrl: '',
    subId: '',
    hubCallback: '',
    hubTopic: ''
};

const subscriptionRecordStub = {
    id: 'ac7856cb-5695-4664-b52f-0dc908e3aa7a',
    hub_topic: 'https://twitch.com',
    lease_start: '2020-03-21 01:01:01'
};

const eventRecordStub = {
    id: '0dc956cb-4664-5695-b52f-ac7808e7aa3a',
    subscription_id: 'ac7856cb-5695-4664-b52f-0dc908e3aa7a',
    data: {}
};

module.exports = { eventRecordStub, subscriptionDummy, subscriptionRecordStub };