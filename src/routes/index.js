const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const _get = require('lodash/get');

router.get('/', (req, res) => res.send('A great website is comming...'));

router.post('/getPicture', async (req, res) => {
  const client_id = process.env.SPOTIFY_ID;
  const client_secret = process.env.SPOTIFY_SECRET;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {

    if (!error && response?.statusCode === 200 && body?.access_token) {

      const { access_token } = body;


      const list = req.body;
      const totalElements = list.length;

      let resp = [];
      for (let i = 0; i < totalElements; i++) {
        const album = list[i].album
        const year = list[i].year

        const query = {
          q: album + ' ' + 'year:' + year,
          type: 'album',
        }

        const queryOK = querystring.stringify(query);

        const options = {
          url: 'https://api.spotify.com/v1/search?' + queryOK,
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };
        request.get(options, function (error, response, body) {
          const album_pict = _get(body, 'albums.items[0].images[0].url', '');

          resp.push({ album, year, album_pict })
          if (resp.length === totalElements)
            res.json(resp)
        });
      }


    }
    else
      res.send('error')
  });

})
module.exports = router;
