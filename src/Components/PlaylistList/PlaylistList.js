import React from "react";
import "./PlaylistList.css";
import Spotify from "../../util/Spotify";
import PlaylistListItem from "../PlaylistListItem/PlaylistListItem";

class PlaylistList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

   componentDidMount() {
     Spotify.getUserPlaylist().then(playlists => this.setState({playlists: playlists}))
  }

  render() {

    return (
        <div className="PlaylistList">
            <h2>Your Playlist</h2>
            {this.state.playlists.map((playlist,index) => (
                <PlaylistListItem 
                onSelect={this.props.onSelect}
                key={index}
                id={playlist.id}
                name={playlist.name}
                tracks={playlist.tracks.href}
                />
            ))}
        </div>
        
    )
  }
}

export default PlaylistList;
