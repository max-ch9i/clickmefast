import React from 'react';
import JoinControl from './JoinControl';
import {dispatch} from '../data/AppDispatcher';

class Lobby extends React.Component<{}, Props, {}> {
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

    _queue(e) {
        e.preventDefault();
        dispatch({
            type: 'queue/join'
        });
    }

    _hit(index, e) {
        e.preventDefault();
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
                return <div><a href onClick={this._queue.bind(this)}>Queue</a></div>;
            case 'queue':
                return <div>Queuing</div>;
            case 'victory':
                return <div>You won!</div>;
            case 'defeat':
                return <div>You lost!</div>;

            case 'game':
                return (<div>
                    <div>
                        <h1>My</h1>
                        <ul className="board my">{this.props.myBoard.map(function(v, i) {
                            return <li key={i} onClick={this._hit.bind(this, i)} className={'v'+v}></li>;
                        }.bind(this))}</ul>
                    </div>
                    <div>
                        <h1>Op</h1>
                        <ul className="board op">{this.props.opBoard.map(function(v, i) {
                            return <li key={i} className={'v'+v}></li>;
                        })}</ul>
                    </div>
                </div>);
        }
    }
}
Lobby.defaultProps = {
    stage: 'init',
    myBoard: [],
    opBoard: []
};

export default Lobby;