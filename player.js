module.exports = {

    VERSION: "1.0.0",

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
            decision,
            raiseBet     = this.getRaiseAmount(currentBuyIn, myCurrentBet, minimumRaise),
            callBet      = this.getCallAmount(currentBuyIn, myCurrentBet);

        if (tableCards.length) {
            if (this.checkIsStreetFlash(allCards)) {
                decision = this.ACTIONS.ALL_IN;
            } else if (this.checkIsCare(allCards)) {
                decision = this.ACTIONS.ALL_IN;
            } else if (this.checkIsFullHouse(allCards)) {
                decision = this.ACTIONS.ALL_IN;
            } else if (this.checkIsFlash(allCards)) {
                decision = this.ACTIONS.ALL_IN;
            } else if (this.checkIsStreet(allCards)) {
                decision = this.ACTIONS.RAISE;
            } else if (this.checkIsSet(allCards)) {
                decision = this.ACTIONS.RAISE;
            } else if (this.checkIsTwoPair(allCards)) {
                decision = this.ACTIONS.CALL;
            } else if (this.checkIsPair(allCards)) {
                decision = this.ACTIONS.CALL;
            } else {
                decision = this.ACTIONS.CALL;
            }
        } else {
            //starting (no flop)
            decision = this.checkCombination(myCards);
        }

        if (decision == this.ACTIONS.RAISE) {
            myBet = raiseBet;
        } else if (decision == this.ACTIONS.CALL) {
            myBet = callBet;
        } else if (decision == this.ACTIONS.ALL_IN) {
            myBet = Math.round(myStack / 2);
            if (myBet < minimumRaise) myBet = myStack;
        }

        console.log('======================================================================');
        console.log('my cards: ' + JSON.stringify(myCards));
        console.log('table cards: ' + JSON.stringify(tableCards));
        console.log('my stack: ' + myStack);
        console.log('decision: ' + decision);
        console.log('my bet: ' + myBet);
        console.log('======================================================================');

        bet(myBet);
    },

    checkCombination: function (myCards) {
        var card1    = myCards[0],
            card2    = myCards[1],
            decision = this.ACTIONS.FOLD;

        if (card1.rank === card2.rank) {
            decision = this.ACTIONS.RAISE;
        } else if (this.HIGH_RANKS.indexOf(card1.rank) > -1 && this.HIGH_RANKS.indexOf(card2.rank) > -1) {
            decision = this.ACTIONS.RAISE;
        }

        return decision;
    },

    getCallAmount: function (currentBuyIn, myCurrentBet) {
        return currentBuyIn - myCurrentBet;
    },

    getRaiseAmount: function (currentBuyIn, myCurrentBet, minimumRaise) {
        return currentBuyIn - myCurrentBet + minimumRaise;
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

    checkIsTwoPair: function (incomingCards) {

        var pair = [];

        for (var i = 0; i < incomingCards.length; i++) {

            var incomingCard = incomingCards[i];

            if (!pair[incomingCard.rank]) pair[incomingCard.rank] = 0;

            pair[incomingCard.rank] = pair[incomingCard.rank] + 1;

        }
        var countPair = 0;

        for (var j in pair) {
            if (pair[j] >= 2) {
                countPair++;

            }
            if (countPair == 2) {

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

    checkIsStreet: function (incomingCards) {
        var arrRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

        var street = [];

        var tempStreet = [];

        if (incomingCards.length < 5) {
            return false;
        }
        for (var z = 0; z < arrRanks.length; z++) {
            street[arrRanks[z]] = 0;
        }

        for (var i = 0; i < incomingCards.length; i++) {

            var incomingCard = incomingCards[i];


            if (!street[incomingCard.rank]) street[incomingCard.rank] = 0;

            street[incomingCard.rank] = street[incomingCard.rank] + 1;


        }
        var countStreet = 0;
        for (var key in street) {

            if (street[key] != 0) {
                countStreet++
            }
            if (countStreet == 5) {
                return true;
            }
            if (street[key] == 0) {
                countStreet = 0;
            }
        }

        return false;

    },

    checkIsFullHouse: function (incomingCards) {
        var fullHouse = [];

        for (var i = 0; i < incomingCards.length; i++) {

            var incomingCard = incomingCards[i];

            if (!fullHouse[incomingCard.rank]) fullHouse[incomingCard.rank] = 0;

            fullHouse[incomingCard.rank] = fullHouse[incomingCard.rank] + 1;

        }
        var pair = false;
        var set = false;

        for (var j in fullHouse) {
            if (fullHouse[j] == 3) {
                set = true;
            }
            if (fullHouse[j] == 2) {
                pair = true;
            }
            if (pair && set) {
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

    checkIsStreetFlash: function (incomingCards) {
        var spades = 0;
        var diamonds = 0;
        var hearts = 0;
        var clubs = 0;


        if (incomingCards.length <= 4) {
            return false
        }


        for (var i = 0; i < incomingCards.length; i++) {
            var incomingCardItem = incomingCards[i];
            if (incomingCardItem.suit == 'spades') {
                spades++;
            }
            if (incomingCardItem.suit == 'diamonds') {
                diamonds++;
            }
            if (incomingCardItem.suit == 'hearts') {
                hearts++;
            }
            if (incomingCardItem.suit == 'clubs') {
                clubs++;
            }
            if (spades == 5 || diamonds == 5 || hearts == 5 || clubs == 5) {
                var arrRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

                var street = [];

                var tempStreet = [];

                if (incomingCards.length < 5) {
                    return false;
                }
                for (var z = 0; z < arrRanks.length; z++) {
                    street[arrRanks[z]] = 0;
                }

                for (var y = 0; y < incomingCards.length; y++) {

                    var incomingCard = incomingCards[y];


                    if (!street[incomingCard.rank]) street[incomingCard.rank] = 0;

                    street[incomingCard.rank] = street[incomingCard.rank] + 1;


                }
                var countStreet = 0;
                for (var key in street) {

                    if (street[key] != 0) {
                        countStreet++
                    }
                    if (countStreet == 5) {
                        return true;
                    }
                    if (street[key] == 0) {
                        countStreet = 0;
                    }
                }


            } else {
                return false;
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

    VERY_HIGH_RANKS: ["A", "Q", "K"],

    // SUITS: ['spades', 'diamonds', 'hearts', 'clubs']

    SUITS: {
        SPADES: 'spades',
        DIAMONDS: 'diamonds',
        HEARTS: 'hearts',
        CLUBS: 'clubs'
    }
};
