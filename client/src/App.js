import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, ProgressBar, Image} from 'react-bootstrap'
import { useState, useEffect} from 'react';
import './styles.css';
import play$ from './play$.png';
import artisfy from './artisfy.png';

const CLIENT_ID = "08e264960fa7499b93f8394f5fa83dc4";
const CLIENT_SECRET = "af59790fe5bb465cb8df276627e1e1dd";

function App(){
  const [searchInput, setSearchInput] = useState("");
  const[accessToken, setAccessToken] = useState("");
  const[artistInfo, setArtistInfo] = useState([]);
  const[tracks, setTracks] = useState([]);
  // blue,red,orange,medpink,lime,balletpink,yellow
  const cardColors = ["#509bf4", "#ffc666", "#f674a2", "#cdf564", "#ffcdd3", "#f6e32d", "#de5843"];

  useEffect(() => {
    // API Access Token
    var authParameters= {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id='+ CLIENT_ID +'&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])
  
  // Search
  async function search() {
    console.log('Search for '+ searchInput); // Taylor Swift
    // Get request using search to get the Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    console.log(artistID);
    // Get request with Artist ID grab the top tracks from that Artist
    var returnTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?include_groups=track&market=US', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTracks(data.tracks) 
      });

    var returnArtists = await fetch ('https://api.spotify.com/v1/artists/' + artistID, searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setArtistInfo(data)
    });
    
    // Display those tracks to the user 

  }
  console.log(tracks);

  const getColorBasedOnPopularity = (popularity) => {
    if (popularity >= 0 && popularity < 50) {
      return 'danger';
    } else if (popularity >= 50 && popularity < 76) {
      return 'warning';
    } else {
      return 'success';
    }
  };
  
  return (
    <div className="App">
      <Container>
        <div className="d-flex flex-wrap justify-content-center">
          <InputGroup className="mb-3" size="lg">
          <Image src={artisfy} fluid style={{ width:'15%', height:'auto'}}/>
            <FormControl
              placeholder="Search for artist"
              type="input"
              onKeyDown={event => {
               if (event.key == "Enter") {
                  search();
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
            />
           <Button className="custom-button" onClick={search}>
              Search
            </Button>
          </InputGroup>
        </div>
      </Container>
      <Container className='mb-2'>
        <Card className="mx-2">
          <Card.Title className='mt-3' style={{ fontSize: '2rem' }}> {artistInfo.name} </Card.Title>
          <Card.Img src={artistInfo.images?.[2]?.url} style={{ width: '20%' }} className="mx-auto mb-4" />
          <ProgressBar className = 'mb-3 mt-2 mx-auto' 
          style={{ width: '20%', height: '50%'}} 
          now ={artistInfo.popularity} 
          label={<span className="progress-label">{`${artistInfo.popularity}`}</span>}/>
          <Card.Text style={{ fontSize: '1.2rem' }}> {artistInfo.followers?.total || 0} followers </Card.Text>
            <div className="d-flex flex-wrap justify-content-center">
              {artistInfo.genres && artistInfo.genres.map((genre, i) => {
                return (
              <Card className="mb-2" key={i}  style={{ backgroundColor: cardColors[i % cardColors.length] }}>
                <Card.Text style={{ fontSize: '1.2rem' }}> {genre}  </Card.Text>
              </Card>
            )})}
            </div>
          <Button className="mx-auto mt-4 mb-3 pink-button" 
          onClick={() => window.location.href = artistInfo.external_urls?.spotify} 
          style={{ width: '20%', fontSize: '1.25rem' }}>
          Play {artistInfo.name} on Spotify
          </Button>
        </Card>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-5">
          {tracks.map( (track, i) => {
            console.log(track);
            return (
              <Card className='mb-2 custom-card'>
                <Card.Img src={track.album.images[0].url} />
                <Card.Body>
                  <Card.Title className = 'mb-2'> {i + 1}. {track.name} </Card.Title>
                  <Card.Text className = 'mb-2'>
                  {track.album.name}
                  </Card.Text>
                  <ProgressBar className = 'mb-2'
                  now ={track.popularity}
                  label={<span>{`${track.popularity}`}</span>}
                  variant={getColorBasedOnPopularity(track.popularity)}/>
                  <div className="d-flex flex-wrap justify-content-center">
                    <Button className='white-button' onClick={() => window.location.href = track.external_urls.spotify}>
                     <Image src={play$} fluid style={{ width: '30%', height: 'auto' }}/>
                    </Button>
                  </div>
                </Card.Body>
            </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;