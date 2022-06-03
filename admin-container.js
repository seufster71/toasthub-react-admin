/*
* Author Edward Seufert
*/
'use strict';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import * as actions from './admin-actions';
import StatusView from '../coreView/status/status-view';
import LoadingView from '../coreView/status/loading-view';
import NavigationBarView from '../coreView/navigation/navigation-bar-view';
import DashboardContainer from './dashboard/dashboard-container';
import BugsContainer from './bugs/bugs-container';
import ChangeRequestsContainer from './changerequests/changerequests-container';
import PreferencesContainer from './preferences/preferences-container';
import PreferenceSubContainer from './preferences/preferences-sub-container';
import SubMenuContainer from './submenu/submenu-container';
import UsersContainer from './users/users-container';
import RolesContainer from './roles/roles-container';
import PermissionsContainer from './permissions/permissions-container';
import LanguageContainer from './language/language-container';
import CategoryContainer from './category/category-container';
import StatusContainer from './status/status-container';
import ServiceContainer from './service/service-container';
import MenuContainer from './menu/menus-container';
import SystemContainer from './system/system-container';
import AdminView from '../adminView/admin-view';
import UserMgmtContainer from './usermgmt/usermgmt-container';
import fuLogger from '../core/common/fu-logger';
import {PrivateRoute} from '../core/common/utils';

function AdminContainer() {
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
  	useEffect(() => {
    	dispatch(actions.init());
	}, []);

  	const changeTab = (code,index) => {
      navigate(index);
	}

    fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"path "+ location.pathname});

    let myMenus = [];
    if (appMenus != null && appMenus[appPrefs.adminMenu] != null) {
      myMenus = appMenus[appPrefs.adminMenu];
    }
    let myPermissions = {};
    if (session != null && session.selected != null && session.selected.permissions != null) {
      myPermissions = session.selected.permissions;
    }
    //fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"menus "+ JSON.stringify(myMenus)});
    if (myMenus.length > 0) {
      return (
        <AdminView>
          <NavigationBarView appPrefs={appPrefs} permissions={myPermissions}
          menus={myMenus} changeTab={changeTab} activeTab={location.pathname} backToTab={"member"} user={session.selected} navigate={navigate}/>
          <StatusView/>
          <Routes>
            <Route index element={<DashboardContainer />}/>
            <Route element={<PrivateRoute permissions={myPermissions} code="AB" pathto="/access-denied"/>} >
				<Route path="/bugs/*" element={<BugsContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ABLA" pathto="/access-denied"/>} >
				<Route path="/buglanes/*" element={<BugsContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ABLI" pathto="/access-denied"/>} >
				<Route path="/buglist/*" element={<BugsContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ACR" pathto="/access-denied"/>} >
				<Route path="/changerequests/*" element={<ChangeRequestsContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AU" pathto="/access-denied"/>} >
				<Route path="/users/*" element={<UsersContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AR" pathto="/access-denied"/>} >
				<Route path="/roles/*" element={<RolesContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AP" pathto="/access-denied"/>} >
				<Route path="/permissions/*" element={<PermissionsContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="APR" pathto="/access-denied"/>} >
				<Route path="/prefmgmt/*" element={<PreferencesContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="APR" pathto="/access-denied"/>} >
				<Route path="/prefsub/*" element={<PreferenceSubContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AL" pathto="/access-denied"/>} >
				<Route path="/language/*" element={<LanguageContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AC" pathto="/access-denied"/>} >
				<Route path="/category/*" element={<CategoryContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AS" pathto="/access-denied"/>} >
				<Route path="/status/*" element={<StatusContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ASVR" pathto="/access-denied"/>} >
				<Route path="/service/*" element={<ServiceContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AM" pathto="/access-denied"/>} >
				<Route path="/menu/*" element={<MenuContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ASYS" pathto="/access-denied"/>} >
				<Route path="/system/*" element={<SystemContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AO" pathto="/access-denied"/>} >
				<Route path="/other/*" element={<SubMenuContainer />} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AUM" pathto="/access-denied"/>} >
				<Route path="/usermgmt/*" element={<UserMgmtContainer />} />
			</Route>
          </Routes>
        </AdminView>
      );
    } else {
      return (
        <AdminView> <LoadingView/>
        </AdminView>
      );
    }
}

export default AdminContainer;
