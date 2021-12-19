<template>
  <div class="container">
    <div class="main-wrapper">
      <img
        :src="currentTrack.album.images[0].url"
        class="now-playing__cover"
        alt=""
      />

      <div class="now-playing__side">
        <div class="now-playing__name">{{ currentTrack.name }}</div>

        <div class="now-playing__artist">
          {{ currentTrack.artists[0].name }}
        </div>
      </div>
    </div>
    <div class="main-wrapper">
      <button class="btn-spotify" @click="volumeDown()">-</button>

      <button class="btn-spotify" @click="player.previousTrack()">
        &lt;&lt;
      </button>

      <button class="btn-spotify" @click="player.togglePlay()">
        {{ isPaused ? "PLAY" : "PAUSE" }}
      </button>

      <button class="btn-spotify" @click="player.nextTrack()">&gt;&gt;</button>

      <button class="btn-spotify" @click="volumeUp()">+</button>
    </div>
    <div class="main-wrapper">
      <img
        :src="nextTrack.album.images[0].url"
        class="now-playing__cover"
        alt=""
      />
      <div class="now-playing__side">
        <h2>Comming next</h2>
        <div class="now-playing__name">{{ nextTrack.name }}</div>

        <div class="now-playing__artist">
          {{ nextTrack.artists[0].name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      player: null,
      currentTrack: {
        name: "",
        album: {
          images: [{ url: "" }],
        },
        artists: [{ name: "" }],
      },
      nextTrack: {
        name: "",
        album: {
          images: [{ url: "" }],
        },
        artists: [{ name: "" }],
      },
      isPaused: false,
      isActive: false,
    };
  },

  mounted() {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(this.token);
        },
        volume: 0.5,
      });

      this.player = player;

      player.addListener("ready", ({ device_id }) => {
        if (this.token) {
          let data = {
            device_ids: [device_id],
            play: true,
          };
          fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + this.token,
            },
            body: JSON.stringify(data),
          }).then((response) => {
            response.json().then((res) => {
              console.log(res);
            });
          });
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();

      player.addListener("player_state_changed", (state) => {
        console.log("state", state);
        if (!state) {
          return;
        }

        this.currentTrack = state.track_window.current_track;
        this.nextTrack = state.track_window.next_tracks[0];
        this.isPaused = state.paused;

        player.getCurrentState().then((state) => {
          !state ? (this.isActive = false) : (this.isActive = true);
        });
      });
    };
  },

  methods: {
    volumeDown() {
      this.player.getVolume().then((volume) => {
        if (volume > 0) {
          let newVolume = volume - 0.1;
          this.player.setVolume(newVolume);
        }
      });
    },

    volumeUp() {
      this.player.getVolume().then((volume) => {
        if (volume < 1) {
          this.player.setVolume((volume += 0.1));
        }
      });
    },
  },

  computed: {
    token() {
      return this.$store.getters.token;
    },
  },
};
</script>
<style scoped></style>
