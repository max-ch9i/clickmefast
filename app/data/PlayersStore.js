import AppDispatcher, {dispatch} from './AppDispatcher.js';
import FireConnectorStore from './FireConnectorStore.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';

class PlayersStore extends MapStore {
    getInitialState() {
        return new Immutable.Map([
            ['stage', 'init'],
            ['myBoard', [1, 1, 1, 1, 1]],
            ['opBoard', [1, 1, 1, 1, 1]]
        ]);
    }
    reduce(state, action) {
        AppDispatcher.waitFor([FireConnectorStore.getDispatchToken()]);
        switch(action.type) {
            case 'current/win':
                return state.set('stage', 'victory');
            case 'opponent/win':
                return state.set('stage', 'defeat');
            
            case 'current/board':
                return state.set('myBoard', action.payload);
            case 'opponent/board':
                return state.set('opBoard', action.payload);
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