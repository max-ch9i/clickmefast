import Board from './Board';

export default class CurrentPlayer {
    constructor(name) {
        if (name) {
            this.name = name;
            this.state = 'lobby';
            this.board = Board.initBoard();
            this.opponent = '';
        }
    }
    setRef(ref) {
        this.ref = ref;
    }
    getRef() {
        return this.ref;
    }
    getJSEntity() {
        return {
            name: this.name,
            state: this.state,
            board: this.board,
            oponent: this.opponent
        };
    }
    standInQueue(onComplete, onFound) {
        if (!this.ref) {
            throw 'Ref hasn\'t been yet assigned for this player';
        }
        this.ref.child('state').set('queue', function() {
            this.ref.on('value', this.waitForGame(onFound));
            onComplete.apply(this);
        }.bind(this));
    }
    waitForGame(onFound) {
        if (!this.ref) {
            throw 'Ref hasn\'t been yet assigned for this player';
        }
        var _wait = function(snapshot) {
            // listen if someone adds you to the game
            var value = snapshot.val();
            if (value['state'] === 'game') {
                this.ref.off('value', _wait);
                onFound.apply(this, [value]);
            }
        }.bind(this);
        return _wait;
    }
    initForGame(opp) {
        this.ref.transaction(function(data) {
            return Object.assign(data, {
                state: 'game',
                board: Board.initBoard(),
                opponent: opp ? opp.getRef().key() : ''
            });
        });
    }
    updateBoard(data, index) {
        var board = Board.parse(data);
        Board.destroyItem(board, index);
        this.ref.child('board').set(Board.forFB(board));
    }
}