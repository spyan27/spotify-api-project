import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import { useState, useEffect} from 'react';

const CLIENT_ID = "08e264960fa7499b93f8394f5fa83dc4";
const CLIENT_SECRET = "af59790fe5bb465cb8df276627e1e1dd";

function App(){
  const [searchInput, setSearchInput] = useState("");
  const[accessToken, setAccessToken] = useState("");
  const[tracks, setTracks] = useState([]);

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

    console.log("Artist ID is " + artistID);
    // Get request with Artist ID grab the top tracks from that Artist
    var returnTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?include_groups=track&market=US', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTracks(data.tracks) 
      });
    
    // Display those tracks to the user 

  }
  console.log(tracks);

  const getTextColor = (popularity) => {
    return popularity > 90 ? 'green' : 'red';
  };
  
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
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
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-5">
          {tracks.map( (track, i) => {
            console.log(track);
            return (
              <Card>
              <Card.Img src={track.album.images[0].url} />
              <Card.Body>
               <Card.Title className = 'mb-2'> {track.name} </Card.Title>
               <Card.Header>
              {track.album.name}
               </Card.Header>
               <Card.Header className = 'mb-5' style={{ color: getTextColor(track.popularity) }}>
                Popularity: {track.popularity}
               </Card.Header>
               <Button className = 'mb-5' onClick={() => window.location.href = track.external_urls.spotify}>
                 Click to listen!
                 </Button>
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