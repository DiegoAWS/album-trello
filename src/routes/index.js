const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const _get = require('lodash/get');

const axios = require('axios');
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



      const getOneAlbum = (album, year) => {
        const query = {
          q: album + ' ' + 'year:' + year,
          type: 'album',
        }

        
        const url = 'https://api.spotify.com/v1/search?' + querystring.stringify(query);
        const options = {
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };
        return axios.get(url, options);

      }
      var p = [];
      for (let i = 0; i < totalElements; i++) {
        const album = list[i].album
        const year = list[i].year

        p.push(getOneAlbum(album, year))
      }

      Promise.all(p).then((data) => {

        const albumsOK = data.map(item => ({
          album_picture: _get(item, 'data.albums.items[0].images[0].url', ''),
          album_name: _get(item, 'data.albums.items[0].name', ''),
          album_artist: _get(item, 'data.albums.items[0].artists[0].name', ''),
          album_year: _get(item, 'data.albums.items[0].release_date', '').slice(0, 4),
        }))
        res.json(albumsOK)

      }).catch(err => {
        console.log('error ', err)
        res.json(err)
      })

      // request.get(options, function (error, response, body) {
      //   const album_pict = _get(body, 'albums.items[0].images[0].url', '');

      //   resp.push({ album, year, album_pict })
      //   if (resp.length === totalElements)
      //     res.json(resp)
      // });



    }
    else
      res.send('error')
  });

})
module.exports = router;
