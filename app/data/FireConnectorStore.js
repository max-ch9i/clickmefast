import AppDispatcher, {dispatch} from './AppDispatcher.js';
import {MapStore} from 'flux/utils';
import Firebase from 'firebase';
import Immutable from 'immutable';
import Board from './Board';
import PlayerList from './PlayerList';
import CurrentPlayer from './CurrentPlayer';
import Opponent from './Opponent';
import Game from './Game';

var _players = new PlayerList('https://volleyup.firebaseio.com/clickmefast/players');

var _currentPlayer = null;
var _opponent = null;

var _game = null;

class FireConnectorStore extends MapStore {
    getInitialState() {
        return new Immutable.Map([
            ['state', 'workingAlways']
        ]);
    }
    initGame(opp) {
        _opponent = opp;
        _game = new Game(_currentPlayer, _opponent, true);
        _game.initGame(function() {
            dispatch({type: 'current/game'});
        }, function(side) {
            dispatch({type: side + '/win'});
        }, function(side, data) {
            dispatch({
                type: side + '/board',
                payload: data
            });
        });
    }
    startQueuing() {
        var _firstInQueue = _players.getFirstQueuingPlayer();
        if (_firstInQueue) {
            _opponent = new Opponent(_firstInQueue);
            this.initGame(_opponent);
        } else {
            _currentPlayer.standInQueue(function() {
                dispatch({type: 'current/queue'});
            }, function(value) {
                var _refOpponent = _players.findOpponent(value['opponent']);
                _opponent = new Opponent(_refOpponent);
                this.initGame(_opponent);
            }.bind(this));
        }
    }
    reduce(state, action) {
        switch(action.type) {
            case 'queue/join':
                this.startQueuing();
                return state;
            case 'lobby/join':
                _currentPlayer = new CurrentPlayer(action.payload);
                _players.addPlayer(_currentPlayer, function() {
                    dispatch({type: 'current/joined'});
                });
                return state;
            case 'do/hit':
                _game.hit(action.payload);
                return state;
            default:
                return state;
        }
    }
}

const store = new FireConnectorStore(AppDispatcher);
export default store;