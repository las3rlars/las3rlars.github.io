class Card {
    constructor(suit, value, index) {
        this.suit = suit;
        this.value = value;
        this.faceUp = false;
        this.index = index;
    }

    toString() {
        return this.suit+this.value;
    }	
}

class Deck {
    constructor() {
        this.cards = [];
        this.suits = ['s', 'c', 'h', 'd'];
        this.values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let index = 0;
        for (let suit of this.suits) {
            for (let value of this.values) {
                this.cards.push(new Card(suit, value, index++));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal() {
        return this.cards.pop();
    }
}

class Solitaire {
    constructor() {
        this.deck = new Deck();
        this.tableau = [[], [], [], [], [], [], []];
        this.foundation = [[], [], [], []];
        this.waste = [];
        this.stock = [];

        this.dealTableau();
    }

    dealTableau() {
        for (let i = 0; i < 7; ++i) {
            for (let j = 0; j <= i; ++j) {
                const card = this.deck.deal();
                if (j === i) {
                    card.faceUp = true;
                }
                this.tableau[i].push(card);
            }
        }

        while (this.deck.cards.length) {
            this.stock.push(this.deck.deal());
        }
    }

	moveCards(source, sourceDepth, target) {
		if (this.isEmptyPile(source)) {
			console.log('No cards to move from source');
			return false;
		}

		const sourceIndex = sourceDepth;
		const card = source[sourceIndex];
		
		console.log('moving: ' + card + ' sourceDepth: ' + sourceDepth + ' sourceLength: ' + source.length + ' sourceIndex: ' + sourceIndex);
		
		if (this.isValidMove(card, target)) {
			for (let i = sourceIndex; i < source.length; ++i) {
				target.push(source[i]);
			}
			source.splice(sourceIndex);
		} else {
			console.log('Invalid move');
			return false;
		}
	}
	
    isValidMove(card, target) {
        if (this.isEmptyPile(target)) {
            return card.value === 'K';
        } else {
            const targetCard = target[target.length - 1];
            const targetValue = this.cardValue(targetCard);
            const cardValue = this.cardValue(card);
            return targetCard.faceUp &&
                targetCard.suit !== card.suit &&
                cardValue === targetValue - 1;
        }
    }

    cardValue(card) {
        if (card.value === 'A') return 1;
        if (card.value === 'J') return 11;
        if (card.value === 'Q') return 12;
        if (card.value === 'K') return 13;
        return parseInt(card.value);
    }

    drawFromStock() {
        if (this.stock.length === 0) {
            while (this.waste.length) {
				let card = this.waste.pop();
				card.faceUp = false;
                this.stock.push(card);
            }
        } else {
            this.waste.push(this.stock.pop());
            this.waste[this.waste.length - 1].faceUp = true;
        }
    }

    moveToFoundation(source, target) {
		const card = source[source.length - 1];
        if (this.isValidFoundationMove(card, target)) {
            target.push(source.pop());
            return true;
        }
        return false;
    }

    isValidFoundationMove(card, target) {
        if (this.isEmptyPile(target)) {
            return card.value === 'A';
        } else {
            const topCard = target[target.length - 1];
            return topCard.suit === card.suit &&
                this.cardValue(card) === this.cardValue(topCard) + 1;
        }
    }

    checkForWin() {
        return this.foundation.every(pile => pile.length === 13);
    }
	
	isEmptyPile(pile) {
		return pile.length === 0;
	}
}