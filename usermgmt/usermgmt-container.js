/*
* Author Edward Seufert
*/
'use-strict';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import * as appPrefActions from '../../core/common/apppref-actions';
import fuLogger from '../../core/common/fu-logger';
import UserMgmtView from '../../adminView/usermgmt/usermgmt-view';

function UserMgmtContainer() {
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	const changeTab = (index) => {
      navigate(index);
  	}

	fuLogger.log({level:'TRACE',loc:'UserMgmtContainer::render',msg:"Hi there"});
	const path = location.pathname;
	let topMenus = appMenus[appPrefs.adminMenu];
	let children = [];
	if (topMenus != null) {
		for (let m = 0; m < topMenus.length; m++) {
			if (topMenus[m].values[0].rendered) {
				if (path.includes(topMenus[m].values[0].href)){
					fuLogger.log({level:'TRACE',loc:'UserMgmtContainer::render',msg:"href " + topMenus[m].values[0].href});
					if (topMenus[m].children != null && topMenus[m].children.length > 0){
						children = topMenus[m].children;
					}
				}
			}
		}
	}
    return (
		<UserMgmtView menus={children} changeTab={changeTab}/>
	);
}


export default UserMgmtContainer;
