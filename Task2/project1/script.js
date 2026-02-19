// --- Elements ---
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('song-artist');
const playlistEl = document.getElementById('playlist');

// --- Song Library (You will need to add actual .mp3 files to your project folder) ---
const songs = [
    {
        title: "Summer Vibes",
        artist: "Artist One",
        src: "song1.mp3" // Replace with actual file path
    },
    {
        title: "Chill Lofi",
        artist: "Artist Two",
        src: "song2.mp3" // Replace with actual file path
    },
    {
        title: "Upbeat Pop",
        artist: "Artist Three",
        src: "song3.mp3" // Replace with actual file path
    }
];

let songIndex = 0;
let isPlaying = false;

// --- Initialization ---
function initPlayer() {
    loadSong(songs[songIndex]);
    buildPlaylist();
}

function loadSong(song) {
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    audio.src = song.src;
    updateActivePlaylistItem();
}

function buildPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="song-info">
                <span class="song-name">${song.title}</span>
                <span class="song-artist-sm">${song.artist}</span>
            </div>
        `;
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistEl.appendChild(li);
    });
    updateActivePlaylistItem();
}

function updateActivePlaylistItem() {
    const items = playlistEl.querySelectorAll('li');
    items.forEach(item => item.classList.remove('active'));
    if(items[songIndex]) {
        items[songIndex].classList.add('active');
    }
}

// --- Playback Controls ---
function playSong() {
    isPlaying = true;
    playBtn.textContent = '⏸️';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.textContent = '▶️';
    audio.pause();
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', () => {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
});

nextBtn.addEventListener('click', () => {
    songIndex++;
    if (songIndex > songs.length - 1) songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
});

// Auto-play next song when current song ends
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// --- Progress Bar & Time ---
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        
        // Format time
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// --- Volume Control ---
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Initialize on load
initPlayer();