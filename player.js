
module.exports = {

  VERSION: "0.0.1",

  bet_request: function(game_state, bet) {
    var myBet = 0,
        myIndex = game_state.in_action;
    
    myBet = game_state.current_buy_in - game_state.players[myIndex].bet;
    
    bet(myBet);
  },

  showdown: function(game_state) {

  }
};
