import AppDispatcher, {dispatch} from './AppDispatcher.js';
import Player from './Player.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import * as Keys from './keys';

const playersConnection = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');
var _playerKey = null;

var generateUID = function() {
    // 0.4129429495536414 -> x4129429495
    var rand = Math.random().toString(10).substr(2, 10);
    return 'x' + new Date().getTime() + rand;
}

playersConnection.on('child_added', function(data) {
    var payload = data.val();
    dispatch({
        type: 'update/child_added',
        payload
    });
});

playersConnection.on('child_removed', function(data) {
    var payload = data.val();
    dispatch({
        type: 'update/child_removed',
        payload
    });
});

class PlayersStore extends MapStore {
    getInitialState() {
        return new Immutable.Map([
            [Keys.keyPlayers, new Immutable.List()],
            [Keys.keyCurrentPlayer, null]
        ]);
    }
    reduce(state, action) {
        switch(action.type) {
            case 'update/child_removed':
                var _updated = state.get(Keys.keyPlayers).filterNot(function(v) {
                    return v.getUID() === action.payload.uid;
                });
                return state.set(Keys.keyPlayers, _updated);
            case 'update/child_added':
                var _player = new Player(action.payload);
                var child_list = state.get(Keys.keyPlayers).push(_player);
                return state.set(Keys.keyPlayers, child_list);
            case 'lobby/join':
                var _pl = {
                    uid: generateUID(),
                    name: action.payload,
                    state: 'idle',
                };
                var newPlayer = playersConnection.push(_pl);
                newPlayer.onDisconnect().remove();
                // Dispatched via update/all
                return state.set(Keys.keyCurrentPlayer, new Player(_pl));
            default:
                return state;
        }
    }
}

const store = new PlayersStore(AppDispatcher);
export default store;