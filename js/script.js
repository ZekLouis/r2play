window.onload = function() {
  var playlistsButtons = document.querySelectorAll('.playlist-link');
  var player = document.querySelector('#audioPlayer');
  var currentPlaylist = [];
  var currentPlaylistPos = 0;
  var currentMusic = 0;
  var isEnabledRepeat = false;
  var isEnabledRandom = false;
  var isPlaying = false;

  // Adds eventlisteners to playlists buttons
  // gets data playlist on click, in order to set the current playlist
  for (i = 0; i < playlistsButtons.length; i++) {
    playlistsButtons[i].addEventListener('click', function() {
      playlistsButtons[currentPlaylistPos].style.color = "#FFF";
      this.style.color = "red";
      menu('off');
      currentPlaylistPos = this.dataset.playlist;
      currentMusic = 0;
      isPlaying = true;
      setPlaylistParams(this.dataset.playlist);

    });
  }

  // Next button action : changes the current music
  document.querySelector("#next").addEventListener('click', function() {
    if(!isEnabledRepeat && !isEnabledRandom) {
      if(currentMusic < currentPlaylist.music.length-1) {
        currentMusic++;
      } else {
        currentMusic = 0;
      }
    } else {
      if(isEnabledRandom) {
        currentMusic = generateRandom(currentMusic, (currentPlaylist.music.length-1))
      }
    }
    setMusic(currentPlaylist.music[currentMusic]);
  })

  // Repeat button action : replays the current song at the end
  document.querySelector('.repeat').addEventListener('click', function() {
    isEnabledRandom = false;
    if(isEnabledRepeat) {
      isEnabledRepeat = false;
    } else {
      isEnabledRepeat = true;
    }
  })

  // Random button action : Randomly choose the next song
  document.querySelector('.random').addEventListener('click', function() {
    isEnabledRepeat = false;
    if(isEnabledRandom) {
      isEnabledRandom = false;
    } else {
      isEnabledRandom = true;
    }
  })

  // Play / Pause button
  document.querySelector('.play').addEventListener('click', function() {
    if(!isPlaying) {
      isPlaying = true;
      player.play();
    } else {
      isPlaying = false;
      player.pause();
    }
  })

  // Detects the end of the song
  // Automatically switch to the next one
  player.addEventListener("ended", function(){
    setTimeout( function() {
      if(!isEnabledRepeat && !isEnabledRandom) {
        if(currentMusic < currentPlaylist.music.length-1) {
          currentMusic++;
        } else {
          currentMusic = 0;
        }
      } else {
        if(isEnabledRandom) {
          currentMusic = generateRandom(currentMusic, (currentPlaylist.music.length-1))
        }
      }
      setMusic(currentPlaylist.music[currentMusic]);
    }, 2000)
  });

  setInterval(function(){
    if(isPlaying) {
      document.querySelector('.progress-wrapper').setAttribute('data-time', getTime(Math.round(player.currentTime)));
    }
  }, 1000);

  setInterval(function() {
    document.querySelector('.progress').style.width = (player.currentTime / player.duration * 100) + "%"
  }, 100)



  /*                 */
  /*    FUNCTIONS    */
  /*                 */
  function setPlaylistParams(current) {
    currentPlaylistPos = parseInt(current);
    currentPlaylist = playlists[currentPlaylistPos];

    setMusic(currentPlaylist.music[currentMusic]);
  }

  function setMusic(music) {
      var cover = document.querySelector('.cover');
      var title = document.querySelector('.title');
      var artist = document.querySelector('.sub-title');

      // Sets current display to the first song
      cover.src = music.img;
      title.innerHTML = music.titre;
      artist.innerHTML = music.artiste;

      player.pause();
      player.src = music.src;
      player.load();
      player.play();
  }
  function generateRandom(current, playlistLength) {
      var randomMusic = Math.floor(Math.random() * (playlistLength));
      while ( randomMusic == current) {
        randomMusic = Math.floor(Math.random() * (playlistLength));
      }

    return randomMusic;
  }

  // Converts seconds to time (minutes:seconds)
  function getTime(value) {
    var min = 0
    var sec = 0

    if (value < 10) {
      sec = "0" + value
    } else {
      if(value < 60) {
        sec = value
      } else {
        min = Math.round(value/60)
        if(value%60 < 10) {
          sec = "0" + value%60
        } else {
          sec = value%60
        }
      }
    }
    return min+":"+sec
  }
}
