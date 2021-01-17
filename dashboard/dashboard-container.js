/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as dashboardActions from './dashboard-actions';
import fuLogger from '../../core/common/fu-logger';
import DashboardView from '../../adminView/dashboard/dashboard-view';
import BaseContainer from '../../core/container/base-container';


class DashboardContainer extends BaseContainer {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		fuLogger.log({level:'TRACE',loc:'DashboardContainer::componentdid',msg:"Hi there"});
		let statCriteria = {startTime:"12-30-2018 20:45:00", endTime:"12-30-2018 20:50:00"};
		this.props.actions.init({statCriteria});
	}

	getState = () => {
		return this.props.dashboard;
	}
	
	getForm = () => {
		return "DASHBOARD_FORM";
	}

  	render() {
		fuLogger.log({level:'TRACE',loc:'DashboardContainer::render',msg:"Hi there trser"});
      	return (
				<DashboardView
				stats={this.props.dashboard}
				/>
			);
  	}
}

DashboardContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	dashboard: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, dashboard:state.dashboard, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(dashboardActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(DashboardContainer);
