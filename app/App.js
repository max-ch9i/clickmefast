import React from 'react';
import {Container} from 'flux/utils';
import Lobby from './components/Lobby';
import PlayersStore from './data/PlayersStore';

class ClickMe extends React.Component {
    static getStores() {
        return [PlayersStore];
    }

    static calculateState(prevState): State {
        return {
        };
    }

    render() {
        return <Lobby players={1} playerID={null}/>;
    }
}

const clickme = Container.create(ClickMe);
export default clickme;