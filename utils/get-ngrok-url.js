const axios = require('axios');

const getPublicUrl = () => {
  axios.get('http://localhost:4040/api/tunnels')
  .then(res => res.data.tunnels[0]['public_url'])
  .catch(err => console.log('Did you start ngrok?'));
};

module.exports = { getPublicUrl };