import React from 'react';
import {Container} from 'flux/utils';
import Lobby from './components/Lobby';
import PlayersStore from './data/PlayersStore';
import * as Keys from './data/keys';

class ClickMe extends React.Component {
    static getStores() {
        return [PlayersStore];
    }

    static calculateState(prevState) {
        return {
            players: PlayersStore.getState().get(Keys.keyPlayers).size,
            currentPlayer: PlayersStore.getState().get(Keys.keyCurrentPlayer)
        };
    }

    render() {
        return <Lobby players={this.state.players} player={this.state.currentPlayer}/>;
    }
}

const clickme = Container.create(ClickMe);
export default clickme;