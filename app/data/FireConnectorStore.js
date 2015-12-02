import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';

const _refPlayers = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');

var _refCurrentPlayer = null;
var _refOpponent = null;

var _snapshotBoardMy = null;
var _snapshotBoardOp = null;

var _snapshotAll = null;

var generateUID = function() {
    // 0.4129429495536414 -> x4129429495
    var rand = Math.random().toString(10).substr(2, 10);
    return 'x' + new Date().getTime() + rand;
}

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
    var board = JSON.parse(_snapshotBoardMy.val());
    board[index] = 0;
    _refCurrentPlayer.child('board').set(JSON.stringify(board));
}

function addCurrentPlayer(name) {
    _refCurrentPlayer = _refPlayers.push({
        name,
        state: 'lobby',
        board: '[]',
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
        initPlayer(_refOpponent, _refCurrentPlayer);
        // Manage own data
        initPlayer(_refCurrentPlayer);
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

function initPlayer(refPlayer, refOp) {
    refPlayer.transaction(function(data) {
        return Object.assign(data, {
            state: 'game',
            board: '[1, 1, 1, 1, 1]',
            oponent: refOp ? refOp.key() : ''
        });
    });
}

function initGame(refPlayer, refOp) {
    dispatch({
        type: 'current/game'
    });

    refPlayer.child('board').on('value', function(snapshot) {
        _snapshotBoardMy = snapshot;
        var data = snapshot.val();
        dispatch({
            type: 'current/board',
            payload: data
        });
    });
    refOp.child('board').on('value', function(snapshot) {
        _snapshotBoardOp = snapshot;
        var data = snapshot.val();
        dispatch({
            type: 'opponent/board',
            payload: data
        });
    });
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