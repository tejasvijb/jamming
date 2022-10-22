let accessToken;
const clientID = "bb2247e32c81414fbb7daffe20363eb9";
const redirectURI = "http://localhost:3000";
const baseUrl = "https://api.spotify.com/v1";
let userID;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location.href = url;
    }
  },

  getCurrentUserID() {
    if (userID) {
      let promise = new Promise((resolve, reject) => {
        resolve(userID);
      });
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return fetch(`${baseUrl}/me`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((responseJson) => responseJson.id);
  },

  search(term) {
    const accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        // console.log(jsonResponse)
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0]["name"],
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  getUserPlaylist() {
    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    return this.getCurrentUserID().then((response) => {
      userID = response;
      return fetch(`${baseUrl}/users/${userID}/playlists`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .then((responseJson) =>
          responseJson.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            tracks: playlist.tracks,
          }))
        );
    });
  },

  getPlaylist(tracks) {
    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return fetch(`${tracks}`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (!responseJson.items) {
          return [];
        }
        return responseJson.items.map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0]["name"],
          album: item.track.album.name,
          uri: item.track.uri,
        }));
      })
  },

  savePlaylist(name, uris) {
    if (!name || !uris) return;

    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return fetch(`${baseUrl}/users/${userID}/playlists`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const playlistID = jsonResponse.id;
        return fetch(
          `${baseUrl}/users/${userID}/playlists/${playlistID}/tracks`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ uris: uris }),
          }
        );
      });
  },
};

export default Spotify;
