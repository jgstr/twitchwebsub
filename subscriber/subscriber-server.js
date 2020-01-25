'use strict';
const express = require('express');
import mysql from 'mysql';

const port = 3000;

const app = express();

app.listen(port);
console.log(`Running on port: ${port}`);

