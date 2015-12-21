import React from 'react';
import Radium from 'radium';
import Styles from './Styles';

class JoinControl extends React.Component {
	controlClick(e) {
		e.preventDefault();
		this.props.click.call();
	}
	render() {
		return (<div>
			<a style={[Styles.buttons.base]} href onClick={this.controlClick.bind(this)}>Join</a>
		</div>);
	}
}
JoinControl.propTypes = {
    click: React.PropTypes.func.isRequired
};

export default Radium(JoinControl);