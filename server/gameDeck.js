module.exports = class GameDeck {
    deck = []
    burnDeck = []

    constructor() {
        this.deck = []
        this._isValidSlap = false
    }

    getIsValidSlap = () => {
        return this._isValidSlap
    }

    checkValidSlap = () => {
        let deckLength = this.deck.length

        if (deckLength < 2) return false

        if (this.deck[deckLength - 2].rank == this.deck[deckLength - 1].rank) {
            return true
        }

        if (deckLength >= 3) {
            if (this.deck[deckLength - 3].rank == this.deck[deckLength - 1].rank) {
                return true
            }
        }

        return false
    }

    addCard = (card) => {
        this.deck.push(card)
        this._isValidSlap = this.checkValidSlap()
    }

    burnCard = (card) => {
        this.burnDeck.push(card)
    }

    clearDeck = () => {
        this.deck = []
    }
}