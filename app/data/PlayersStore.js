import AppDispatcher, {dispatch} from './AppDispatcher.js';
import Player from './Player.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import * as Keys from './keys';

const playersConnection = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');
var _playerKey = null;
var _opponentKey = null;
var _snapShotAll = null;

var generateUID = function() {
    // 0.4129429495536414 -> x4129429495
    var rand = Math.random().toString(10).substr(2, 10);
    return 'x' + new Date().getTime() + rand;
}

playersConnection.on('value', function(data) {
    var payload = data.val();
    var snapshot = data;
    dispatch({
        type: 'update/all',
        payload,
        snapshot
    });
});

class PlayersStore extends MapStore {
    getInitialState() {
        return new Immutable.Map([
            [Keys.keyPlayers, new Immutable.List()],
            [Keys.keyQueuingPlayers, new Immutable.List()],
            [Keys.keyCurrentPlayer, null],
            [Keys.keyOpponent, null],
        ]);
    }
    reduce(state, action) {
        switch(action.type) {
            case 'queue/join':
                var _queuingPlayers = state.get(Keys.keyQueuingPlayers);
                if (_queuingPlayers.size === 0) {
                    _playerKey.set(state.get(Keys.keyCurrentPlayer).queue().toObj());
                } else {
                    var _op = _queuingPlayers.first();
                    var _opUID = _op.uid;
                    _playerKey.set(state.get(Keys.keyCurrentPlayer).play().toObj());

                    _snapShotAll.forEach(function(data) {
                        var v = data.val();
                        if (v.uid === _opUID) {
                            _opponentKey = data.ref();
                            _opponentKey.set(Object.assign(v, {state: 'play'}));
                            _opponentKey.on('value', function(data) {
                                var payload = data.val();
                                dispatch({
                                    type: 'update/opponent',
                                    payload
                                });
                            });
                            return true;
                        }
                    });
                }
                return state;
            case 'lobby/join':
                var _pl = {
                    uid: generateUID(),
                    name: action.payload,
                    state: 'idle'
                };
                _playerKey = playersConnection.push(_pl);
                _playerKey.onDisconnect().remove();
                _playerKey.on('value', function(data) {
                    var payload = data.val();
                    dispatch({
                        type: 'update/current',
                        payload
                    });
                });
                // Dispatched via update/current
                return state;


            case 'update/all':
                var _list = new Immutable.OrderedMap(action.payload);
                var _queuingPlayers = _list.filter(function(v) {
                    return v.state === 'queue';
                });
                _snapShotAll = action.snapshot;
                return state.set(Keys.keyPlayers, _list).set(Keys.keyQueuingPlayers, _queuingPlayers);
            case 'update/opponent':
                return state.set(Keys.keyOpponent, new Player(action.payload));
            case 'update/current':
                return state.set(Keys.keyCurrentPlayer, new Player(action.payload));
            default:
                return state;
        }
    }
}

const store = new PlayersStore(AppDispatcher);
export default store;