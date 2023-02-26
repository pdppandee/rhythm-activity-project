import { Midi } from "@tonejs/midi";

export default {
  created() {
    const play = this.$store.state.play;
    if (!play.players) {
      this.$router.push({ name: "pickBand" });
    }
  },
  methods: {
    async analyseMidi(song) {
      if (song.midiUrl) {
        const midi = await Midi.fromUrl(song.midiUrl);
        const tracks = midi.tracks
          .filter((track) => track.notes.length > 0)
          .map((track) => [...track.notes]);

        let octaveCount = {};
        tracks.map((notes) =>
          notes.forEach((note) => {
            if (!octaveCount[note.octave]) {
              octaveCount[note.octave] = 1;
            } else {
              octaveCount[note.octave] += 1;
            }
          })
        );

        let popularOctave = 0;
        let popularOctaveCount = 0;
        for (let key in octaveCount) {
          if (octaveCount[key] > popularOctaveCount) {
            popularOctaveCount = octaveCount[key];
            popularOctave = parseInt(key);
          }
        }

        let maxOctave = Math.max(
          ...Object.keys(octaveCount).map((it) => parseInt(it))
        );

        // if there is no another octave then shift the max octave up 1 step
        if (popularOctave === maxOctave) {
          maxOctave += 1;
        }

        return {
          maxOctave,
          notes: [].concat(...tracks),
        };
      }
      return null;
    },
  },
};
