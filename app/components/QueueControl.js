import React from 'react';
import Radium from 'radium';
import Styles from './Styles';

class QueueControl extends React.Component {
	controlClick(e) {
		e.preventDefault();
		this.props.click.call();
	}
	render() {
		return (<div>
			<a style={[Styles.buttons.base, styles.base]} href onClick={this.controlClick.bind(this)}>Queue</a>
		</div>);
	}
}
QueueControl.propTypes = {
    click: React.PropTypes.func.isRequired
};

var styles = {
	base: {
		backgroundColor: '#00BCD4',
		':active': {
			backgroundColor: '#00ACC1'
		}
	}
};

export default Radium(QueueControl);