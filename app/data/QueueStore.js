import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import type {Action} from './Actions';
import PlayerStore from './PlayerStore';
import {playerNumQ} from './QueueStoreKeys';
import {playerID} from './PlayerStoreKeys';

const queue = new Firebase('https://volleyup.firebaseio.com/clickmefast/queue');
var _playerQueueKey = '';

queue.on('value', function(data) {
    var inQueue = data.val();
    dispatch({
        type: 'queue/players-number-update',
        number: inQueue !== null ? Object.keys(inQueue).length : 0
    });
});

class QueueStore extends MapStore<Symbol, any> {
    reduce(state: Immutable.Map, action: Action) {
        switch(action.type) {
            case 'queue/join':
                let inQueue = state.get(playerNumQ);
                // Find the earliest item in the waiting list
                if (inQueue === 0) {
                    // Add myself to the queue
                    _playerQueueKey = queue.push(PlayerStore.getState().get(playerID));
                    _playerQueueKey.onDisconnect().remove();
                } else {
                    // Join the first entry in the game
                    
                }
                return state;
                break;
            case 'queue/players-number-update':
                return state.set(playerNumQ, action.number);
                break;
            default:
                return state;
        }
    }
}

const store = new QueueStore(AppDispatcher);
export default store;