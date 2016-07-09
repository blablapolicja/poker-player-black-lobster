module.exports = {

    VERSION: "0.0.3",

    bet_request: function (game_state, bet) {
        var myBet        = 0,
            myIndex      = game_state.in_action,
            currentBuyIn = game_state.current_buy_in,
            myCurrentBet = game_state.players[myIndex].bet,
            myCards      = game_state.players[myIndex].hole_cards,
            myStack      = game_state.players[myIndex].stack,
            tableCards   = game_state.community_cards,
            allCards     = myCards.concat(tableCards),
            minimumRaise = game_state.minimum_raise,
            decision;

        if (tableCards.length) {
            myBet = currentBuyIn - myCurrentBet;

            if (this.checkIsCare(allCards)) {
                decision = this.ACTIONS.ALL_IN;
            } else if (this.checkIsFlash(allCards)) {
                decision = this.ACTIONS.ALL_IN;
            } else if (this.checkIsSet(allCards)) {
                decision = this.ACTIONS.RAISE;
            } else if (this.checkIsPair(allCards)) {
                decision = this.ACTIONS.RAISE;
            } else {
                decision = this.ACTIONS.CALL;
            }
        } else {
            decision = this.checkCombination(myCards);
        }

        if (decision == this.ACTIONS.RAISE) {
            myBet = this.getRaiseAmount(currentBuyIn, myCurrentBet);
        } else if (decision == this.ACTIONS.CALL) {
            myBet = this.getCallAmount(currentBuyIn, myCurrentBet, minimumRaise);
        } else if (decision == this.ACTIONS.ALL_IN) {
            myBet = myStack;
        }

        bet(myBet);
    },

    // decisionMaker: function (game_state, myIndex, currentBuyIn, myCurrentBet, minimumRaise) {
    //     var myBet = 0,
    //         decision = this.checkCombination(game_state, myIndex);
    //
    //     if (decision == this.ACTIONS.RAISE) {
    //         myBet = this.getRaiseAmount(currentBuyIn, myCurrentBet);
    //     } else if (decision == this.ACTIONS.CALL) {
    //         myBet = this.getCallAmount(currentBuyIn, myCurrentBet, minimumRaise);
    //     }
    //
    //     return myBet;
    // },

    checkCombination: function (myCards) {
        var card1    = myCards[0],
            card2    = myCards[1],
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

    checkIsFlash: function (incomingCards) {
        var spades = 0;
        var diamonds = 0;
        var hearts = 0;
        var clubs = 0;


        if (incomingCards.length <= 4) {
            return false;
        }


        for (var i = 0; i < incomingCards.length; i++) {
            var incomingCardItem = incomingCards[i];

            if (incomingCardItem.suit == this.SUITS.SPADES) {
                spades++;
            }
            if (incomingCardItem.suit == this.SUITS.DIAMONDS) {
                diamonds++;
            }
            if (incomingCardItem.suit == this.SUITS.HEARTS) {
                hearts++;
            }
            if (incomingCardItem.suit == this.SUITS.CLUBS) {
                clubs++;
            }
            if (spades == 5 || diamonds == 5 || hearts == 5 || clubs == 5) {
                return true;

            }
        }
        return false;
    },

    checkIsPair: function (incomingCards) {

        var pair = [];

        for (var i = 0; i < incomingCards.length; i++) {

            var incomingCard = incomingCards[i];

            if (!pair[incomingCard.rank]) pair[incomingCard.rank] = 0;

            pair[incomingCard.rank] = pair[incomingCard.rank] + 1;

        }

        for (var j in pair) {
            if (pair[j] >= 2) {
                return true;
            }
        }

        return false;

    },

    checkIsSet: function (incomingCards) {

        var pair = [];

        for (var i = 0; i < incomingCards.length; i++) {

            var incomingCard = incomingCards[i];

            if (!pair[incomingCard.rank]) pair[incomingCard.rank] = 0;

            pair[incomingCard.rank] = pair[incomingCard.rank] + 1;

        }

        for (var j in pair) {
            if (pair[j] >= 3) {
                return true;
            }
        }

        return false;

    },

    checkIsCare: function (incomingCards) {
        var checkCare = 0;
        var arrCombination = [];

        if (incomingCards.length < 4) {
            return false;
        }

        for (var i = 0; i < incomingCards.length; i++) {
            var incomingCardItem = incomingCards[i];

            if (!arrCombination[incomingCardItem.rank]) {
                arrCombination[incomingCardItem.rank] = 0;
            }

            arrCombination[incomingCardItem.rank] = arrCombination[incomingCardItem.rank] + 1;
        }

        for (var k in arrCombination) {
            if (arrCombination.hasOwnProperty(k)) {
                if (arrCombination[k] == 4) {
                    return true;
                }
            }
        }

        return false;
    },

    showdown: function (game_state) {

    },

    ACTIONS: {
        FOLD: 'fold',
        RAISE: 'raise',
        CALL: 'call',
        ALL_IN: 'allIn'
    },

    ALL_RANKS: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],

    HIGH_RANKS: ["A", "10", "J", "Q", "K"],

    // SUITS: ['spades', 'diamonds', 'hearts', 'clubs']

    SUITS: {
        SPADES: 'spades',
        DIAMONDS: 'diamonds',
        HEARTS: 'hearts',
        CLUBS: 'clubs'
    }
};
