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
            case 'current/board':
                var board = JSON.parse(action.payload);
                return state.set('myBoard', board);
            case 'opponent/board':
                var board = JSON.parse(action.payload);
                return state.set('opBoard', board);
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