import "./App.css";
import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playist";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [
        { name: "name1", artist: "artist1", album: "album1", id: "id1" },
        { name: "name2", artist: "artist2", album: "album2", id: "id2" },
        { name: "name3", artist: "artist3", album: "album3", id: "id3" },
      ],
      playlistName: "Vibe worthy",
      playlistTracks: [
        { name: "name1", artist: "artist1", album: "album1", id: "id1" },
        // { name: "name2", artist: "artist2", album: "album2", id: "id2" },
        { name: "name3", artist: "artist3", album: "album3", id: "id3" },
      ],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let index = tracks.findIndex((savedTrack) => savedTrack.id === track.id);
    if (index > -1) {
      tracks.splice(index, 1);
    }
    this.setState({ playlistTracks: tracks });
  }
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
