const express = require('express');
const cors = require('cors');
const routes = require('./routes/');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api', routes);

const port = process.env.PORT || 5000;


if (process.env.NODE_ENV === 'production') {
  // Serving React static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing redirects
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server Up and Running ${port}`);
});
