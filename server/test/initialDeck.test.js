const InitialDeck = require('../initialDeck');

describe('deck functions',() => {
    let deck = new InitialDeck()
    it('deck has all 52 cards', () => {
        expect(deck.deck.length).toBe(52)
    })

    it('ditributes cards to 4 players', () => {
        let hands = deck.distributeDeck(4)
        expect(hands[0].length).toBe(13)
        expect(hands[1].length).toBe(13)
        expect(hands[2].length).toBe(13)
        expect(hands[3].length).toBe(13)
    }) 
})

