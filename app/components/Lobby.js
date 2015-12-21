import React from 'react';
import JoinControl from './JoinControl';
import QueueControl from './QueueControl';
import GameControl from './GameControl';
import {dispatch} from '../data/AppDispatcher';

class Lobby extends React.Component<{}, Props, {}> {
    constructor(props) {
        super(props);
    }

    _join() {
        var name =
            // prompt('What is your username?');
            'Rupert';

        dispatch({
            type: 'lobby/join',
            payload: name
        });
    }

    _queue() {
        dispatch({
            type: 'queue/join'
        });
    }

    _hit(index) {
        dispatch({
            type: 'do/hit',
            payload: index
        });
    }

    render() {
        switch (this.props.stage) {
            case 'init':
                return <JoinControl click={this._join}/>;
            case 'idle':
                return <QueueControl click={this._queue}/>;
            case 'queue':
                return <div>Queuing</div>;
            case 'victory':
                return <div>You won!</div>;
            case 'defeat':
                return <div>You lost!</div>;
            case 'game':
                return <GameControl hit={this._hit} myBoard={this.props.myBoard} opBoard={this.props.opBoard}/>;
        }
    }
}
Lobby.defaultProps = {
    stage: 'init',
    myBoard: [],
    opBoard: []
};

export default Lobby;