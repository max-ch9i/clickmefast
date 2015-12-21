import React from 'react';
import JoinControl from './JoinControl';
import QueueControl from './QueueControl';
import GameControl from './GameControl';
import {dispatch} from '../data/AppDispatcher';
import Radium from 'radium';

class Lobby extends React.Component {
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
                return (<div style={styles.scores}>
                    <h1>You won!</h1>
                    <QueueControl click={this._queue}/>
                </div>);
            case 'defeat':
                return (<div style={styles.scores}>
                    <h1>You lost!</h1>
                    <QueueControl click={this._queue}/>
                </div>);
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

var styles = {
    scores: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    }
};

export default Radium(Lobby);