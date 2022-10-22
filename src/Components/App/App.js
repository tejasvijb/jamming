import "./App.css";
import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playist";
import Spotify from "../../util/Spotify";
import PlaylistList from "../PlaylistList/PlaylistList";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistId: null,
      playlistName: "New Playlist",
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  selectPlaylist = (tracks,name,playlistId) => {
    Spotify.getPlaylist(tracks).then(playlistTracks => {this.setState({
      playlistTracks: playlistTracks,
      playlistName: name,
      playlistId: playlistId,
      getPlaylistTracks: tracks
    })})

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

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris,this.state.playlistId,this.state.getPlaylistTracks).then((res) => {
      this.setState({ playlistName: "New Playlist", playlistTracks: [], playlistId:null });
    });
  }

  search(term) {
    // console.log(term)
    Spotify.search(term).then((data) => {
      this.setState({ searchResults: data });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
          <PlaylistList onSelect={this.selectPlaylist}/>
        </div>
      </div>
    );
  }
}

export default App;
