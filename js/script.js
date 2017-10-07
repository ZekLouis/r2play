window.onload = function() {

  var playlistsButtons = document.querySelectorAll('.playlist-link');
  var player = document.querySelector('#audioPlayer');
  var currentPlaylist = [];
  var currentPlaylistPos = 0;
  var currentMusic = 0;
  var isEnabledRepeat = false;
  var isEnabledRandom = false;
  var isPlaying = false;
  var red = "#e74c3c";

  // initialisation
  currentMusic = 0;
  currentPlaylistPos = 0;
  setPlaylistParams(0);
  playlistsButtons[currentPlaylistPos].style.color = red;
  isPlaying = true;

  // Adds eventlisteners to playlists buttons
  // gets data playlist on click, in order to set the current playlist
  for (i = 0; i < playlistsButtons.length; i++) {
    playlistsButtons[i].addEventListener('click', function() {
      playlistsButtons[currentPlaylistPos].style.color = "#FFF";
      this.style.color = red;
      menu('off');
      currentPlaylistPos = this.dataset.playlist;
      currentMusic = 0;
      isPlaying = true;
      setPlaylistParams(this.dataset.playlist);
    });
  }

  // Next button action : changes the current music
  document.querySelector("#next").addEventListener('click', function() {
    document.querySelector('.play').style.display = "none";
    document.querySelector('.pause').style.display = "block";
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
    setMusic(currentPlaylist.music[currentMusic],currentPlaylist,currentMusic);
  });

  // Repeat button action : replays the current song at the end
  document.querySelector('.repeat').addEventListener('click', function() {
    isEnabledRandom = false;
    document.querySelector('div.album-preview').style.display = "block";
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
      document.querySelector('div.album-preview').style.display = "block";
      isEnabledRandom = false;
    } else {
      document.querySelector('.random').classList.add('active');
      document.querySelector('div.album-preview').style.display = "none";
      isEnabledRandom = true;
    }
  });

  // Play / Pause button
  document.querySelector('.play').addEventListener('click', function() {
    if(!isPlaying) {
      isPlaying = true;
      document.querySelector('.play').style.display = "none";
      document.querySelector('.pause').style.display = "block";
      player.play();
    } else {
      isPlaying = false;
      document.querySelector('.pause').style.display = "none";
      document.querySelector('.play').style.display = "block";
      player.pause();
    }
  });

  document.querySelector('.pause').addEventListener('click', function() {
      if(!isPlaying) {
          isPlaying = true;
          document.querySelector('.play').style.display = "none";
          document.querySelector('.pause').style.display = "block";
          player.play();
      } else {
          document.querySelector('.pause').style.display = "none";
          document.querySelector('.play').style.display = "block";
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
      setMusic(currentPlaylist.music[currentMusic],currentPlaylist,currentMusic);
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
  }, 1000);



  /*                 */
  /*    FUNCTIONS    */
  /*                 */
  function setPlaylistParams(current) {
    currentPlaylistPos = parseInt(current);
    currentPlaylist = playlists[currentPlaylistPos];

    setMusic(currentPlaylist.music[currentMusic],currentPlaylist,currentMusic);
  }

  function setMusic(music,currentPlaylist,currentMusic) {
      isPlaying = true;
      document.querySelector('.play').style.display = "none";
      document.querySelector('.pause').style.display = "block";
      var cover = document.querySelector('.cover');
      var title = document.querySelector('.title');
      var artist = document.querySelector('.sub-title');

      var preview_cover = document.querySelector('div.album-preview img');
      var preview_title = document.querySelector('div.album-preview .title');
      var preview_artist = document.querySelector('div.album-preview .sub-title');
      var preview = null;

      if(typeof currentPlaylist.music[currentMusic+1] !== "undefined"){
        preview = currentPlaylist.music[currentMusic+1];
      } else {
        preview = currentPlaylist.music[0];
      }

      preview_cover.src = preview.img;
      preview_title.innerHTML = preview.titre;
      preview_artist.innerHTML = preview.artiste;
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
