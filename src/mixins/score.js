export default {
  methods: {
    calculatePlayerScore(score) {
      return (score * 10).toFixed(0);
    },
    calculateBandScore(players) {
      if (!players || players.length === 0) return 0;

      return (
        (players.map((player) => +player.score) || []).reduce((a, b) => a + b, 0) /
        players.length
      ).toFixed(0);
    },
  },
};
