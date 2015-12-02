import AppDispatcher, {dispatch} from './AppDispatcher.js';
import Player from './Player.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import * as Keys from './keys';

const _refPlayers = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');

var _refCurrentPlayer = null;

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
            default:
                return state;
        }
    }
}

function addCurrentPlayer(name) {
    _refCurrentPlayer = _refPlayers.push({
        name,
        state: 'lobby'
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
        var _opponentRef = firstPlayerQueue.ref();
        _opponentRef.child('state').set('game');
        _refCurrentPlayer.child('state').set('game');
        dispatch({
            type: 'current/game'
        });
    } else {
        _refCurrentPlayer.child('state').set('queue', function() {
            _refCurrentPlayer.child('state').on('value', waitForGame);
            dispatch({
                type: 'current/queue'
            });
        });
    }
}

function waitForGame(snapshot) {
    // listen if someone adds you to the game
    var value = snapshot.val();
    if (value === 'game') {
        _refCurrentPlayer.child('state').off('value', waitForGame);
        dispatch({
            type: 'current/game'
        });                
    }
}

const store = new FireConnectorStore(AppDispatcher);
export default store;