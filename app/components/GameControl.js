import React from 'react';
import Radium from 'radium';
import Styles from './Styles';

class GameControl extends React.Component {
	controlHit(index, e) {
		e.preventDefault();
		this.props.hit.call(this, index);
	}
	render() {
		return (<div>
            <div>
                <h1>My board</h1>
                <ul className="board my">{this.props.myBoard.map(function(v, i) {
                    return <li key={i} onClick={this.controlHit.bind(this, i)} className={'v'+v}></li>;
                }.bind(this))}</ul>
            </div>
            <div>
                <h1>Opponent&#39;s board</h1>
                <ul className="board op">{this.props.opBoard.map(function(v, i) {
                    return <li key={i} className={'v'+v}></li>;
                })}</ul>
            </div>
        </div>);
	}
}
GameControl.propTypes = {
    hit: React.PropTypes.func.isRequired,
    myBoard: React.PropTypes.array.isRequired,
    opBoard: React.PropTypes.array.isRequired
};

export default Radium(GameControl);