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
            stage: PlayersStore.getState().get('stage')
        };
    }

    render() {
        return <Lobby stage={this.state.stage}/>;
    }
}

const clickme = Container.create(ClickMe);
export default clickme;