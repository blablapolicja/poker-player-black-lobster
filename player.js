module.exports = {

    VERSION: "0.0.2",

    bet_request: function (game_state, bet) {
        var myBet        = 0,
            myIndex      = game_state.in_action,
            currentBuyIn = game_state.current_buy_in,
            myCurrentBet = game_state.players[myIndex].bet,
            minimumRaise = game_state.minimum_raise,
            decision;

        if (game_state.community_cards.length) {
            myBet = game_state.current_buy_in - game_state.players[myIndex].bet;
        } else {
            decision = this.checkCombination(game_state, myIndex);

            if (decision == this.ACTIONS.RAISE) {
                myBet = this.getRaiseAmount(currentBuyIn, myCurrentBet);
            } else if (decision == this.ACTIONS.CALL) {
                myBet = this.getCallAmount(currentBuyIn, myCurrentBet, minimumRaise);
            }
        }

        bet(myBet);
    },

    checkCombination: function (game_state, myIndex) {
        var myHand   = game_state.players[myIndex].hole_cards,
            card1    = myHand[0],
            card2    = myHand[1],
            decision = this.ACTIONS.FOLD;

        if (card1.rank === card2.rank) {
            decision = this.ACTIONS.RAISE;
        } else if (this.HIGH_RANKS.indexOf(card1.rank) > -1 && this.HIGH_RANKS.indexOf(card2.rank) > -1) {
            decision = this.ACTIONS.RAISE;
        } else if (card1.suit == card2.suit) {
            decision = this.ACTIONS.CALL;
        }

        return decision;
    },

    getCallAmount: function (currentBuyIn, myCurrentBet) {
        var myBet = 0;

        myBet = currentBuyIn - myCurrentBet;

        return myBet;
    },

    getRaiseAmount: function (currentBuyIn, myCurrentBet, minimumRaise) {
        var myBet = 0;

        myBet = currentBuyIn - myCurrentBet + minimumRaise;

        return myBet;
    },

    showdown: function (game_state) {

    },

    ACTIONS: {
        FOLD: 'fold',
        RAISE: 'raise',
        CALL: 'call'
    },

    RANKS: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],

    HIGH_RANKS: ["A", "10", "J", "Q", "K"],

    SUITS: ['spades', 'diamonds', 'hearts', 'clubs']
};
