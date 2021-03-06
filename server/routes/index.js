const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const _get = require('lodash/get');

const axios = require('axios');
router.get('/', (req, res) => res.send('A great website is comming...'));

router.post('/getPictures', async (req, res) => {
  const client_id = process.env.SPOTIFY_ID;
  const client_secret = process.env.SPOTIFY_SECRET;



  axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    params: {
      grant_type: "client_credentials"
    },
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: {
      username: client_id,
      password: client_secret
    }
  }).then(data => {

    const { access_token } = data?.data;


    const getOriginalInfo = url => {

      const queryParams = url.split('?').slice(-1)[0]
      const parsed = querystring.parse(queryParams).q
      const splited = parsed.split(' year:')
      return {
        album_name: splited[0],
        album_year: splited[1],
      }
    }


    const getOneAlbum = (album, year, token) => {

      const query = { q: album + ' ' + 'year:' + year, type: 'album', }

      const options = {
        url: 'https://api.spotify.com/v1/search?' + querystring.stringify(query),
        headers: { 'Authorization': 'Bearer ' + token }
      };
      return axios(options);
    }

    var p = [];
    const list = req.body;
    for (let i = 0; i < list.length; i++) {
      const album = list[i].album
      const year = list[i].year

      p.push(getOneAlbum(album, year, access_token))
    }

    Promise.all(p).then((data) => {

      const albumsOK = data.map(item => {
        album_picture=_get(item, 'data.albums.items[0].images[0].url', '/imgs/error.jpg')
        
        return {
        album_picture,
        album_artist: _get(item, 'data.albums.items[0].artists[0].name', ''),
        ...getOriginalInfo( _get(item, 'config.url', '')),
      }}
      
      )
     

      res.json(albumsOK)

    }).catch(err => {
      console.log('error REQUESTING ALBUMS', err)
      res.json(err)
    })


  }).catch(err => {
    console.log('error TOKEN', { err })
    res.send('error')
  });

})
module.exports = router;
