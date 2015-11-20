import React from 'react';
import {dispatch} from '../data/AppDispatcher';
import {lobby, queue} from '../data/dataRef';
import Player from '../data/Player';

type Props = {
    players: number,
    playerID: Player
};

class Lobby extends React.Component<{}, Props, {}> {
    constructor(props) {
        super(props);
    }

    _join(e) {
        e.preventDefault();
        dispatch({
            type: 'queue/join',
            player: this.props.playerID
        });
    }

    componentDidMount() {
        // Move this code out!
        var name =
            // prompt('What is your username?');
            'Rupert';

        dispatch({
            type: 'lobby/join',
            name: name
        });
    }

    render() {
        return (
            <div>
                <div>There are {this.props.players} player</div>
                {this.props.playerID ? <div>Your name is {this.props.playerID.name}</div> : null}
                <div><a href onClick={this._join.bind(this)}>Join</a></div>
            </div>
        );
    }
}
Lobby.defaultProps = {
    players: 0,
    playerID: null
};

export default Lobby;