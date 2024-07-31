const pusher = new Pusher("787e05d557a8480c3ee7",{
    cluster: "mt1"
}).subscribe('916ab9aa-a659-4d92-871e-8abdcb92d2f2');

pusher.bind("messages", (async function(data) {

    // const mensagem = data['DonatorMessage'];
    const mensagem = '!sr https://open.spotify.com/intl-pt/track/64BbK9SFKH2jk86U3dGj2P?si=d6523633eb814f44';
    const isSongRequest = await verificaDonateSongRequest(mensagem)

    if(isSongRequest) {
        return new Promise(async (resolve, reject) => {
            const isValidSpotifyLink = await verificaLinkSpotify(isSongRequest)
            if(isValidSpotifyLink) resolve(isValidSpotifyLink)
    
            reject('Não é um link válido')
        }).then((spotifyLink) => {
            const track = spotifyLink.split('track/')[1].split('?')[0]
    
            addTrackToPlaylist(track)
        })
      }
})) 

async function verificaDonateSongRequest(donateText) {
    if(donateText.includes('!sr')) {
        return donateText.split('!sr ')[1]
    } else {
        return false;
    }
}

async function verificaLinkSpotify(linkSongRequest) {
    if(linkSongRequest.includes('spotify.com' && 'track')) {
        return linkSongRequest;
    } else {
        return false;
    }
}

async function addTrackToPlaylist(track) {
    axios.post('https://songrequestt-production.up.railway.app/request', {track_id: track}).then(response => {
        const ulRequest = document.getElementById('requests')
        const liTrack = document.createElement('li')

        liTrack.innerHTML = `${response.data.body.name} - ${response.data.body.artists[0].name}`;
        ulRequest.appendChild(liTrack)
    }).catch(err => {
        console.log(err);
    })
}
