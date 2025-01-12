const GameDeck = require('../gameDeck')

describe('game deck functions',() => {
    describe('checks for valid slap when a card is added', () => {
        let deck = new GameDeck()
        it('double', () => {
            deck.addCard({rank: '3', suit: 'h'})
            deck.addCard({rank: '3', suit: 'd'})

            expect(deck.getIsValidSlap()).toBe(true)
        })

        it('sandwich', () => {
            deck.addCard({rank: 'K', suit: 'd'})
            deck.addCard({rank: '7', suit: 's'})
            deck.addCard({rank: '5', suit: 'c'})
            deck.addCard({rank: '7', suit: 'h'})

            expect(deck.getIsValidSlap()).toBe(true)
        })
    })

    describe('checks for invalid slap when a card is added', () => {
        let deck = new GameDeck()
        it('double', () => {
            deck.addCard({rank: '3', suit: 'h'})
            deck.addCard({rank: '5', suit: 'd'})

            expect(deck.getIsValidSlap()).toBe(false)
        })

        it('sandwich', () => {
            deck.addCard({rank: 'K', suit: 'd'})
            deck.addCard({rank: '7', suit: 's'})
            deck.addCard({rank: '5', suit: 'c'})
            deck.addCard({rank: '9', suit: 'h'})

            expect(deck.getIsValidSlap()).toBe(false)
        })
    })
})