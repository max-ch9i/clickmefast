import React from 'react';

export default class JoinControl extends React.Component {
	_styles() {
		return {
			display: 'inline-block',
			width: 100,
			height: 100,
			backgroundColor: 'magenta',
			textAlign: 'center',
			lineHeight: '100px',
			color: 'white',
			textDecoration: 'none'
		};
	}
	controlClick(e) {
		e.preventDefault();
		this.props.click.call();
	}
	render() {
		return (<div>
			<a style={this._styles()} href onClick={this.controlClick.bind(this)}>Join</a>
		</div>);
	}
}
JoinControl.propTypes = {
    click: React.PropTypes.func.isRequired
};