import Board from './Board';

export default class Game {
    constructor(player, opponent, initPlayers) {
        if (initPlayers) {
            player.initForGame();
            opponent.initForGame(player);
        }
        this.player = player;
        this.opponent = opponent;
        this._boardSnapshots = {
            _snapshotBoardMy: null,
            _snapshotBoardOp: null
        };
        this.refBoardPlayer = null;
        this.refBoardOp = null;
    }
    initGame(onInit, onVictory, onBoardUpdate) {
        onInit.apply(this);
        this.onVictory = onVictory.bind(this);
        this.onBoardUpdate = onBoardUpdate.bind(this);
        this.refBoardPlayer = this.player.getRef().child('board');
        this.refBoardOp = this.opponent.getRef().child('board');
        this.refBoardPlayer.on('value', this.updateBoard('current', '_snapshotBoardMy'));
        this.refBoardOp.on('value', this.updateBoard('opponent', '_snapshotBoardOp'));
    }
    updateBoard(side, cacheEntry) {
        return function(snapshot) {
            this._boardSnapshots[cacheEntry] = snapshot;
            var data = snapshot.val();
            if (Board.haveIWon(data)) {
                this.refBoardPlayer.off();
                this.refBoardOp.off();
                this.onVictory(side);
            } else {
                this.onBoardUpdate(side, Board.parse(data));
            }
        }.bind(this);
    }
    hit(index) {
        this.player.updateBoard(this._boardSnapshots['_snapshotBoardMy'].val(), index);
    }
}