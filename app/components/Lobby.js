import React from 'react';
import {dispatch} from '../data/AppDispatcher';

class Lobby extends React.Component<{}, Props, {}> {
    constructor(props) {
        super(props);
    }

    _join(e) {
        e.preventDefault();
        var name =
            // prompt('What is your username?');
            'Rupert';

        dispatch({
            type: 'lobby/join',
            payload: name
        });
    }

    _queue(e) {
        e.preventDefault();
        dispatch({
            type: 'queue/join'
        });
    }


    render() {
        switch (this.props.stage) {
            case 'init':
                return <div><a href onClick={this._join.bind(this)}>Join</a></div>;
            case 'idle':
                return <div><a href onClick={this._queue.bind(this)}>Queue</a></div>;
            case 'queue':
                return <div>Queuing</div>;
            case 'game':
                return <div>In game!</div>;
        }
    }
}
Lobby.defaultProps = {
    stage: 'init'
};

export default Lobby;