import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import type {Action} from './Actions';
import Player from '../data/Player';
import {playerNumL} from './LobbyStoreKeys';

const lobby = new Firebase('https://volleyup.firebaseio.com/clickmefast/lobby');
var _playerLobbyKey = null;

lobby.on('value', function(data) {
    var playersLobby = data.val();
    dispatch({
        type: 'lobby/players-number-update',
        number: playersLobby !== null ? Object.keys(playersLobby).length : 0
    });
});

class LobbyStore extends MapStore<Symbol, any> {
    reduce(state: Immutable.Map, action: Action) {
        switch(action.type) {
            case 'queue/join':
                _playerLobbyKey.remove();
                return state;
                break;
            case 'lobby/players-number-update':
                return state.set(playerNumL, action.number);
                break;
            case 'lobby/join':
                _playerLobbyKey = lobby.push(action.name);
                _playerLobbyKey.onDisconnect().remove();
                return state;
                break;
            default:
                return state;
        }
    }
}

const store = new LobbyStore(AppDispatcher);
export default store;