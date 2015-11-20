import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import type {Action} from './Actions';
import Player from '../data/Player';
import {playerID} from './PlayerStoreKeys';

var _player = null;

class PlayerStore extends MapStore<Symbol, any> {
    reduce(state: Immutable.Map, action: Action) {
        switch(action.type) {
            case 'lobby/join':
                _player = new Player(action.name);
                return state.set(playerID, _player);
                break;
            default:
                return state;
        }
    }
}

const store = new PlayerStore(AppDispatcher);
export default store;