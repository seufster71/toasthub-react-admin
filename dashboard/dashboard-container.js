/*
* Author Edward Seufert
*/
'use-strict';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import * as dashboardActions from './dashboard-actions';
import fuLogger from '../../core/common/fu-logger';
import DashboardView from '../../adminView/dashboard/dashboard-view';
import BaseContainer from '../../core/container/base-container';


function DashboardContainer() {
	const dashboard = useSelector((state) => state.dashboard);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(dashboardActions.init(location.state.parent,location.state.parentType));
		} else {
			dispatch(dashboardActions.init());
		}
	}, []);

	const getState = () => {
		return dashboard;
	}
	
	const getForm = () => {
		return "DASHBOARD_FORM";
	}

	fuLogger.log({level:'TRACE',loc:'DashboardContainer::render',msg:"Hi there trser"});
  	return (
		<DashboardView
			stats={dashboard}
			/>
	);
}

export default DashboardContainer;
