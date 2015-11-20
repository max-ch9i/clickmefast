import React from 'react';
import {Container} from 'flux/utils';
import LobbyStore from './data/LobbyStore';
import QueueStore from './data/QueueStore';
import PlayerStore from './data/PlayerStore';
import Table from './components/Table';
import Lobby from './components/Lobby';
import {playerNumL} from './data/LobbyStoreKeys';
import {playerNumQ} from './data/QueueStoreKeys';
import {playerID} from './data/PlayerStoreKeys';
import type Player from './data/Player';

type State = {
    playersNumL: number,
    playerID: Player
};

class ClickMe extends React.Component<{}, {}, State> {
    static getStores(): Array<Store> {
        return [LobbyStore, QueueStore, PlayerStore];
    }

    static calculateState(prevState): State {
        var lobbyState = LobbyStore.getState();
        return {
            playersNumL: lobbyState.get(playerNumL),
            playersNumQ: QueueStore.get(playerNumQ),
            playerID: PlayerStore.get(playerID)
        };
    }

    render() {
        return <Lobby players={this.state.playersNumL} playerID={this.state.playerID}/>;
    }
}

const clickme = Container.create(ClickMe);
export default clickme;