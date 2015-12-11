import React from 'react';

export default class JoinControl extends React.Component {
	controlClick(e) {
		e.preventDefault();
		this.props.click.call();
	}
	render() {
		return (<div>
			<a href onClick={this.controlClick.bind(this)}>Join</a>
		</div>);
	}
}
JoinControl.propTypes = {
    click: React.PropTypes.func.isRequired
};