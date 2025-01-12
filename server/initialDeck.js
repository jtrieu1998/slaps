const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const SUITS = ['s', 'c', 'd', 'h']
const NUM_CARDS = 52

module.exports = class InitialDeck {
    deck = []

    constructor() {
        this.deck = this.generateAndShuffleDeck()
    }
    
    generateAndShuffleDeck = () => {
        SUITS.forEach((s) => {
            RANKS.forEach((r) => {
                let card = { rank: r, suit: s }
                card.rank = r
                card.suit = s
                this.deck.push(card)
            })
        })
    
        let card1, card2, temp
    
        for (let i = 0; i < 1000; i++) {
            card1 = Math.floor((Math.random() * this.deck.length));
            card2 = Math.floor((Math.random() * this.deck.length));
            temp = this.deck[card1];
    
            this.deck[card1] = this.deck[card2]
            this.deck[card2] = temp
        }
    
        return this.deck
    }

    distributeDeck = (numPlayers) => {
        let hands = new Array(numPlayers).fill([])

        for(let i = 0; i < NUM_CARDS; i++){
            let card = this.deck.pop()
            if (i < numPlayers){
                hands[i%numPlayers] = [card]
            } else {
                hands[i % numPlayers].push(card)
            }
        }
        return hands
    }

    clearDeck = () => {
        this.deck = [];
        return
    }
}


