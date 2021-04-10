const express = require('express');
const cors = require('cors');
const routes = require('./routes/');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/', routes);

const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server Up and Running ${port}`);
});
