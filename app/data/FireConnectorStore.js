import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import Board from './Board';

const _refPlayers = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');

var _refCurrentPlayer = null;
var _refOpponent = null;

var _boardSnapshots = {
    _snapshotBoardMy: null,
    _snapshotBoardOp: null
};

var _snapshotAll = null;

_refPlayers.on('value', function(data) {
    _snapshotAll = data;
});

class FireConnectorStore extends MapStore {
    getInitialState() {
        return new Immutable.Map([
            ['state', 'workingAlways']
        ]);
    }
    reduce(state, action) {
        switch(action.type) {
            case 'queue/join':
                startQueuing();
                return state;
            case 'lobby/join':
                addCurrentPlayer(action.payload);
                return state;
            case 'do/hit':
                hit(action.payload);
                return state;
            default:
                return state;
        }
    }
}

function hit(index) {
    var board = Board.parse(_boardSnapshots['_snapshotBoardMy'].val());
    Board.destroyItem(board, index);
    _refCurrentPlayer.child('board').set(Board.forFB(board));
}

function addCurrentPlayer(name) {
    _refCurrentPlayer = _refPlayers.push({
        name,
        state: 'lobby',
        board: Board.initBoard(),
        oponent: ''
    }, function() {
        dispatch({
            type: 'current/joined',
            payload: name
        });
    });
    _refCurrentPlayer.onDisconnect().remove();
}

function startQueuing() {
    var firstPlayerQueue = null;
    _snapshotAll.forEach(function(snapshot) {
        var v = snapshot.val();
        if (v.state === 'queue') {
            firstPlayerQueue = snapshot;
            return true;
        }
    });

    if (firstPlayerQueue) {
        // Draw the player into the game
        _refOpponent = firstPlayerQueue.ref();
        // Manage oponents data
        initPlayerForGame(_refOpponent, _refCurrentPlayer);
        // Manage own data
        initPlayerForGame(_refCurrentPlayer);
        initGame(_refCurrentPlayer, _refOpponent)
    } else {
        _refCurrentPlayer.child('state').set('queue', function() {
            _refCurrentPlayer.on('value', waitForGame);
            dispatch({
                type: 'current/queue'
            });
        });
    }
}

function initPlayerForGame(refPlayer, refOp) {
    refPlayer.transaction(function(data) {
        return Object.assign(data, {
            state: 'game',
            board: Board.initBoard(),
            oponent: refOp ? refOp.key() : ''
        });
    });
}

function initGame(refPlayer, refOp) {
    dispatch({
        type: 'current/game'
    });
    var refBoardPlayer = refPlayer.child('board');
    var refBoardOp = refOp.child('board');
    refBoardPlayer.on('value', updateBoard('current', _boardSnapshots, '_snapshotBoardMy', refBoardPlayer));
    refBoardOp.on('value', updateBoard('opponent', _boardSnapshots, '_snapshotBoardOp', refBoardOp));
}

function updateBoard(side, snapshotCache, cacheEntry, refBoard) {
    return function(snapshot) {
        snapshotCache[cacheEntry] = snapshot;
        var data = Board.parse(snapshot.val());
        if (Board.haveIWon(data)) {
            refBoard.off();
            dispatch({
                type: side + '/win'
            });
        } else {
            dispatch({
                type: side + '/board',
                payload: data
            });
        }
    }
}

function waitForGame(snapshot) {
    // listen if someone adds you to the game
    var value = snapshot.val();
    if (value['state'] === 'game') {
        _refCurrentPlayer.off('value', waitForGame);
        _refOpponent = _snapshotAll.child(value['oponent']).ref();
        initGame(_refCurrentPlayer, _refOpponent);
    }
}

const store = new FireConnectorStore(AppDispatcher);
export default store;