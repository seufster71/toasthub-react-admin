/*
* Author Edward Seufert
*/
'use strict';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from "react-router-dom";
import * as actions from './admin-actions';
import StatusView from '../coreView/status/status-view';
import LoadingView from '../coreView/status/loading-view';
import NavigationView from '../coreView/navigation/navigation-view';
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
import ECMarketContainer from '../adminec/market/market-container';
import ECStoreContainer from '../adminec/store/store-container';
import fuLogger from '../core/common/fu-logger';
import {PrivateRoute} from '../core/common/router-utils-web';

export default function AdminContainer({location,navigate}) {
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	
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
          <NavigationView appPrefs={appPrefs} permissions={myPermissions}
          menus={myMenus} changeTab={changeTab} activeTab={location.pathname} backToTab={"member"} user={session.selected} navigate={navigate}/>
          <StatusView/>
          <Routes>
            <Route index element={<DashboardContainer location={location} navigate={navigate}/>}/>
            <Route element={<PrivateRoute permissions={myPermissions} code="AB" pathto="/access-denied"/>} >
				<Route path="/bugs/*" element={<BugsContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ABLA" pathto="/access-denied"/>} >
				<Route path="/buglanes/*" element={<BugsContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ABLI" pathto="/access-denied"/>} >
				<Route path="/buglist/*" element={<BugsContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ACR" pathto="/access-denied"/>} >
				<Route path="/changerequests/*" element={<ChangeRequestsContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AU" pathto="/access-denied"/>} >
				<Route path="/users/*" element={<UsersContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AR" pathto="/access-denied"/>} >
				<Route path="/roles/*" element={<RolesContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AP" pathto="/access-denied"/>} >
				<Route path="/permissions/*" element={<PermissionsContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="APR" pathto="/access-denied"/>} >
				<Route path="/prefmgmt/*" element={<PreferencesContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="APR" pathto="/access-denied"/>} >
				<Route path="/prefsub/*" element={<PreferenceSubContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AL" pathto="/access-denied"/>} >
				<Route path="/language/*" element={<LanguageContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AC" pathto="/access-denied"/>} >
				<Route path="/category/*" element={<CategoryContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AS" pathto="/access-denied"/>} >
				<Route path="/status/*" element={<StatusContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ASVR" pathto="/access-denied"/>} >
				<Route path="/service/*" element={<ServiceContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AM" pathto="/access-denied"/>} >
				<Route path="/menu/*" element={<MenuContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="ASYS" pathto="/access-denied"/>} >
				<Route path="/system/*" element={<SystemContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AO" pathto="/access-denied"/>} >
				<Route path="/other/*" element={<SubMenuContainer location={location} navigate={navigate}/>} />
			</Route>
            <Route element={<PrivateRoute permissions={myPermissions} code="AUM" pathto="/access-denied"/>} >
				<Route path="/usermgmt/*" element={<UserMgmtContainer location={location} navigate={navigate}/>} />
			</Route>
			<Route element={<PrivateRoute permissions={myPermissions} code="AECMARKET" pathto="/access-denied"/>} >
				<Route path="/ec-markets/*" element={<ECMarketContainer location={location} navigate={navigate}/>} />
			</Route>
			<Route element={<PrivateRoute permissions={myPermissions} code="AECSTORE" pathto="/access-denied"/>} >
				<Route path="/ec-stores/*" element={<ECStoreContainer location={location} navigate={navigate}/>} />
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
