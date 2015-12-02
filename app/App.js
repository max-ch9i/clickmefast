import React from 'react';
import {Container} from 'flux/utils';
import Lobby from './components/Lobby';
import PlayersStore from './data/PlayersStore';

class ClickMe extends React.Component {
    static getStores() {
        return [PlayersStore];
    }

    static calculateState(prevState) {
        var _state = PlayersStore.getState();
        return {
            stage: _state.get('stage'),
            myBoard: _state.get('myBoard'),
            opBoard: _state.get('opBoard')
        };
    }

    render() {
        return <Lobby stage={this.state.stage} myBoard={this.state.myBoard} opBoard={this.state.opBoard}/>;
    }
}

const clickme = Container.create(ClickMe);
export default clickme;