import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';

type State = {
    players: Array;
    state: string;
};

var keyPlayers = Symbol();

const playersConnection = new Firebase('https://volleyup.firebaseio.com/clickmefast/players');
var _playerKey = null;

playersConnection.on('value', function(data) {
    var players = data.val();
    dispatch({
        type: 'update/all',
        players
    });
});

class PlayersStore extends MapStore {
    reduce(state: State, action) {
        switch(action.type) {
            case 'update/all':
                // transform to a map
                let _players = new Immutable.OrderedMap(action.players);
                return state.set(keyPlayers, _players);
                break;
            case 'lobby/join':
                var _player = {name: action.name};
                var newPlayer = playersConnection.push(_player);
                newPlayer.onDisconnect().remove();
                // Dispatched via update/all
                return state;
                break;
            default:
                return state;
        }
    }
}

const store = new PlayersStore(AppDispatcher);
export default store;