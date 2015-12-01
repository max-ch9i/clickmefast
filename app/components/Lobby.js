import React from 'react';
import {dispatch} from '../data/AppDispatcher';

class Lobby extends React.Component<{}, Props, {}> {
    constructor(props) {
        super(props);
    }

    _join(e) {
        e.preventDefault();
        // dispatch({
        //     type: 'queue/join',
        //     player: this.props.player
        // });
        var name =
            // prompt('What is your username?');
            'Rupert';

        dispatch({
            type: 'lobby/join',
            payload: name
        });
    }

    render() {
        return (
            <div>
                <div>There are {this.props.players} player</div>
                {this.props.player ? <div>Your name is {this.props.player.getName()}</div> : null}
                {this.props.player ? null : <div><a href onClick={this._join.bind(this)}>Join</a></div>}
            </div>
        );
    }
}
Lobby.defaultProps = {
    players: 0,
    player: null
};

export default Lobby;