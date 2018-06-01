import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: null,
      isPlaying: false,
      isMouseInside : false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
      this.setIcon("ion-md-play", index);
    }
    else {
      if (!isSameSong) {
        this.setIcon("remove-classes", index);
        this.setSong(song);
      }
      this.play();
      this.setIcon("ion-md-pause", index);
    }
  }

  setIcon(className, index) {
    const spanTag = document.getElementById(`span-${index}`);
    spanTag.innerText = "";
    switch(className) {
      case "ion-md-pause" :
        spanTag.classList.remove("ion-md-play");
        spanTag.className += " ion-md-pause";
        console.log("pauseeee");
        break;
      case "ion-md-play" :
        spanTag.classList.remove("ion-md-pause");
        spanTag.className += " ion-md-play";
        break;
      case "remove-classes" :
        this.state.album.songs.map((key, index) => {
          const spanTag2 = document.getElementById(`span-${index}`);
          spanTag2.classList.remove("ion-md-pause");
          spanTag2.innerText = index + 1;
        })
        break;
      default :
        this.state.album.songs.map((key, index) => {
          const spanTag2 = document.getElementById(`span-${index}`);
          const getCurrentSong = this.state.album.songs[index];
          if (this.state.currentSong !== getCurrentSong) {
            spanTag2.classList.remove("ion-md-pause", "ion-md-play");
            spanTag2.innerText = index +1;
          }
          else if (!this.state.isPlaying){
            spanTag2.classList.remove("ion-md-play", "ion-md-pause");
            spanTag2.innerText = index + 1;
          }
      })
    }
  }

  mouseEnter = (index) => {
    const isSameSong = this.state.currentSong === this.state.album.songs[index];
    this.setState({ isMouseInside: true });
    if (this.state.isPlaying && isSameSong) {
      this.setIcon("ion-md-pause", index);
    }
    else {
      this.setIcon("ion-md-play", index);

    }
  }

  mouseLeave = (index) => {
    const isSameSong = this.state.currentSong === this.state.album.songs[index];
    this.setState({ isMouseInside: false});
    if (this.state.isPlaying && isSameSong) {
      this.setIcon("ion-md-pause", index);
    }
    else {
      this.setIcon("", index);
    }
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {
              this.state.album.songs.map( (song, index) =>
                <tr className="song" key={index} id={`td-${index}`} onClick={() => this.handleSongClick(song, index)} >
                  <td onMouseEnter= {() => this.mouseEnter(index)} onMouseLeave={() => this.mouseLeave(index)}>
                    <span id={`span-${index}`} className="song-number">{index + 1}</span>
                  </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{song.duration}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;
