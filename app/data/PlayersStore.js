import AppDispatcher, {dispatch} from './AppDispatcher.js';
import Player from './Player.js';
import FireConnectorStore from './FireConnectorStore.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import * as Keys from './keys';

class PlayersStore extends MapStore {
    getInitialState() {
        return new Immutable.Map([
            ['stage', 'init']
        ]);
    }
    reduce(state, action) {
        AppDispatcher.waitFor([FireConnectorStore.getDispatchToken()]);
        switch(action.type) {
            case 'current/game':
                return state.set('stage', 'game');
            case 'current/queue':
                return state.set('stage', 'queue');
            case 'current/joined':
                return state.set('stage', 'idle');
            default:
                return state;
        }
    }
}

const store = new PlayersStore(AppDispatcher);
export default store;