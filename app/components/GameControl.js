import React from 'react';
import Radium from 'radium';

class GameControl extends React.Component {
	controlHit(index, e) {
		e.preventDefault();
		this.props.hit.call(this, index);
	}
	render() {
		return (<div>
            <div>
                <h1>My board</h1>
                <ul style={styles.board}>{this.props.myBoard.map(function(v, i) {
                    return <li key={i} onClick={this.controlHit.bind(this, i)} style={this.stylePiece(v, i)}></li>;
                }.bind(this))}</ul>
            </div>
            <div>
                <h1>Opponent&#39;s board</h1>
                <ul style={styles.board}>{this.props.opBoard.map(function(v, i) {
                    return <li key={i} style={this.stylePiece(v, i, true)}></li>;
                }.bind(this))}</ul>
            </div>
        </div>);
	}
	translatePiece(index) {
		var size = 50,
			padding = 10;
		return index * (size + padding) + 'px';
	}
	opacityPiece(value) {
		return value === 1 ? 1 : 0;
	}
	stylePiece(v, i, op) {
		var _piece = {};
		Object.assign(_piece, styles.piece, {
			transform: 'translateX(' + this.translatePiece(i) + ')',
			opacity: this.opacityPiece(v)
		});

		if (op) {
			return [_piece, styles.pieceOp];
		}

		return _piece;
	}
}
GameControl.propTypes = {
    hit: React.PropTypes.func.isRequired,
    myBoard: React.PropTypes.array.isRequired,
    opBoard: React.PropTypes.array.isRequired
};

var styles = {
	board: {
		listStyle: 'none outside none',
		position: 'relative',
		width: '290px',
		height: '50px',
		padding: 0
	},
	piece: {
		position: 'absolute',
		height: '50px',
		width: '50px',
		backgroundColor: 'blue'
	},
	pieceOp: {
		backgroundColor: 'red'
	}
};

export default Radium(GameControl);