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
        if (!this.props.player) {
            return <a href onClick={this._join.bind(this)}>Join</a>;
        } else {
            switch (this.props.player.getState()) {
                case 'idle':
                    return (
                        <div>
                            <div>There are {this.props.players} player</div>
                            <div>Your name is {this.props.player.getName()}</div>
                            <div><a href onClick={this._queue.bind(this)}>Queue</a></div>
                        </div>
                    );                    
                case 'queue':
                    return <div>Queuing</div>;
                case 'play':
                    return <div>In game!</div>;
            }
        }
    }
}
Lobby.defaultProps = {
    players: 0,
    player: null
};

export default Lobby;