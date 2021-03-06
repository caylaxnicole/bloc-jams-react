import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './../index.css';

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
      isMouseInside : false,
      songIndex : 0,
      currentTime: 0,
      duration: album.songs[0].duration,
      currentVolume: 0.5
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ currentVolume: this.audioElement.currentVolume });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange',
    this.eventListeners.volumechange);
  }

  componentWillUnmount(){
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange',
    this.eventListeners.volumechange);
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
    this.setState({ songIndex : index || this.state.songIndex});
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

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }
  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume });
  }


  formatTime(totalSeconds) {
    const wholeMinutes = Math.floor(totalSeconds/ 60);
    const secondsLeftOver = Math.floor(totalSeconds % 60);
      if (secondsLeftOver < 10){
        return wholeMinutes + ':0' + secondsLeftOver;
      }
      else if (secondsLeftOver >= 10){
        return wholeMinutes + ':' + secondsLeftOver;
      }
      else {
        return '-:--'
      }
    }



  setIcon(className, index) {
    const songIndex = index === undefined ? this.state.songIndex : index;
    const spanTag = document.getElementById(`span-${songIndex}`);
    spanTag.innerText = "";
    switch(className) {
      case "ion-md-pause" :
        spanTag.classList.remove("ion-md-play");
        spanTag.className += " ion-md-pause";
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
                <tr className="song" key={index} onClick={() => this.handleSongClick(song, index)} >
                  <td onMouseEnter= {() => this.mouseEnter(index)} onMouseLeave={() => this.mouseLeave(index)}>
                    <span id={`span-${index}`} className="song-number">{index + 1}</span>
                  </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.formatTime(parseInt(song.duration, 10))}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          currentVolume={this.audioElement.currentVolume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(totalSeconds) => this.formatTime(totalSeconds)}
        />
      </section>
    );
  }
}

export default Album;
