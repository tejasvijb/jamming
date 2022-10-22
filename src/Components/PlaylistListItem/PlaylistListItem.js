import React from "react";
import "./PlaylistListItem.css";
import Spotify from "../../util/Spotify";

class PlaylistListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
   this.props.onSelect(e.target.id)
   
  };

  render() {
    return (
      <>
      <input type="radio" id={this.props.id} name="playlist" className="PlaylistListItem" value={this.props.key}/>
      <label onClick={this.onClick}  className="playlistLabel" id={this.props.tracks} htmlFor={this.props.id}>{this.props.name}</label>
      </>
    );
  }
}

export default PlaylistListItem;
