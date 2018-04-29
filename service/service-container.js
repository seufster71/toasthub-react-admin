/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as serviceActions from './service-actions';
import fuLogger from '../../core/common/fu-logger';
import ServiceView from '../../adminView/service/service-view';


class ServiceContainer extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.props.actions.initServices();
	}

	onClick(code,index) {
		fuLogger.log({level:'TRACE',loc:'ServiceContainer::onClick',msg:"clicked " + code});

	}

  render() {
			fuLogger.log({level:'TRACE',loc:'ServiceContainer::render',msg:"Hi there"});
      return (
				<ServiceView services={this.props.services}/>
			);
  }
}

ServiceContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	services: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs, services:state.services};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(serviceActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(ServiceContainer);
