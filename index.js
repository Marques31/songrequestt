const express = require('express');
const axios = require('axios')
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

// Crie uma instância da API
const spotifyApi = new SpotifyWebApi({
    clientId: '24604eb43ab4456e82f8aa73f9fccdb9',
    clientSecret: 'd9e0f7ce222d4c19ab958acb8ed8dfed',
    redirectUri: 'https://songrequestt-production.up.railway.app/callback' // Substitua pela sua URI de redirecionamento
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000;

const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private'
];
  
app.get('/login', (req, res) => {
    const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeUrl);
});

app.get('/callback', (req, res) => {
    const code = req.query.code;
   
    spotifyApi.authorizationCodeGrant(code).then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);

        res.redirect('http://localhost:3000/home');
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error exchanging code for token');
    });
});

app.post('/request', async (req, res) => {
    await spotifyApi.addTracksToPlaylist(['2mS2nwyCxtANFsHzl6Mh8i'], [`spotify:track:${req.body.track_id}`]).then(async (data) => {
        const track = await spotifyApi.getTrack(req.body.track_id)
        res.send(track);
    }, function(err) {
        throw err;
    });
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
