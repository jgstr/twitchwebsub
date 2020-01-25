'use strict';
const express = require('express');

const port = 3001;

const app = express();

app.listen(port);
console.log(`Running on port: ${port}`);
