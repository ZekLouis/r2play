window.onload = function() {

  var playlistsButtons = document.querySelectorAll('.playlist-link');
  var player = document.querySelector('#audioPlayer');
  var currentPlaylist = [];
  var currentPlaylistPos = 0;
  var currentMusic = 0;
  var isEnabledRepeat = false;
  var isEnabledRandom = false;
  var isPlaying = false;
  var pausePath = "M2 2h5v12h-5zM9 2h5v12h-5z";
  var playPath = "M3 2l10 6-10 6z";

  // initialisation
  currentMusic = 0;
  currentPlaylistPos = 0;
  setPlaylistParams(0);
  isPlaying = true;

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
  });

  // Repeat button action : replays the current song at the end
  document.querySelector('.repeat').addEventListener('click', function() {
    isEnabledRandom = false;
    document.querySelector('.random').classList.remove('active');
    if(isEnabledRepeat) {
      document.querySelector('.repeat').classList.remove('active');
      isEnabledRepeat = false;
    } else {
      document.querySelector('.repeat').classList.add('active');
      isEnabledRepeat = true;
    }
  });

  // Random button action : Randomly choose the next song
  document.querySelector('.random').addEventListener('click', function() {
    isEnabledRepeat = false;
    document.querySelector('.repeat').classList.remove('active');
    if(isEnabledRandom) {
      document.querySelector('.random').classList.remove('active');
      isEnabledRandom = false;
    } else {
      document.querySelector('.random').classList.add('active');
      isEnabledRandom = true;
    }
  });

  // Play / Pause button
  document.querySelector('.play').addEventListener('click', function() {
    if(!isPlaying) {
      document.querySelector('.play path').d = pausePath;
      isPlaying = true;
      player.play();
    } else {
      document.querySelector('.play path').d = playPath;
      isPlaying = false;
      player.pause();
    }
  });

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

  player.addEventListener("durationchange", function(){
    document.querySelector('.progress-wrapper').setAttribute('data-total', getTime(Math.round(player.duration)));
  });

  setInterval(function(){
    if(isPlaying) {
      document.querySelector('.progress-wrapper').setAttribute('data-time', getTime(Math.round(player.currentTime)));
    }
  }, 1000);

  setInterval(function() {
    document.querySelector('.progress').style.width = (player.currentTime / player.duration * 100) + "%"
  }, 100);



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
      while (randomMusic == current) {
        randomMusic = Math.floor(Math.random() * (playlistLength));
      }

    return randomMusic;
  }

  // Converts seconds to time (minutes:seconds)
  function getTime(value) {
    var sec_num = parseInt(value, 10);
    var minutes = Math.floor((sec_num) / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
  }
}
