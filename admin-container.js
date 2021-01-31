/*
* Author Edward Seufert
*/
'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Switch, Route, withRouter, Redirect} from "react-router";
import * as adminActions from './admin-actions';
import LoginContainer from '../core/usermgnt/login-container';
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
import fuLogger from '../core/common/fu-logger';
import {PrivateRoute} from '../core/common/utils';

class AdminContainer extends Component {
  constructor(props) {
		super(props);
    this.state = {
      activeTab:"HOME"
    };

    this.changeTab = this.changeTab.bind(this);
	}

  componentDidMount() {
    this.props.actions.initAdmin();
  }

  changeTab(code,index) {
      //this.setState({activeTab:code});
      this.props.history.replace(index);
  }

  render() {
    fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"path "+ this.props.history.location.pathname + " state " + JSON.stringify(this.state)});

    let myMenus = [];
    if (this.props.appMenus != null && this.props.appMenus[this.props.appPrefs.adminMenu] != null) {
      myMenus = this.props.appMenus[this.props.appPrefs.adminMenu];
    }
    let myPermissions = {};
    if (this.props.session != null && this.props.session.selected != null && this.props.session.selected.permissions != null) {
      myPermissions = this.props.session.selected.permissions;
    }
    //fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"menus "+ JSON.stringify(myMenus)});
    if (myMenus.length > 0) {
      return (
        <AdminView>
          <NavigationView appPrefs={this.props.appPrefs} permissions={myPermissions}
          menus={myMenus} changeTab={this.changeTab} activeTab={this.props.history.location.pathname} backToTab={"member"} user={this.props.session.selected}/>
          <StatusView/>
          <Switch>
            <Route exact path="/admin" component={DashboardContainer}/>
            <PrivateRoute path="/admin-bugs" component={BugsContainer} permissions={myPermissions} code="AB" pathto="/access-denied"/>
            <PrivateRoute path="/admin-buglanes" component={BugsContainer} permissions={myPermissions} code="ABLA" pathto="/access-denied"/>
            <PrivateRoute path="/admin-buglist" component={BugsContainer} permissions={myPermissions} code="ABLI" pathto="/access-denied"/>
            <PrivateRoute path="/admin-changerequests" component={ChangeRequestsContainer} permissions={myPermissions} code="ACR" pathto="/access-denied"/>
            <PrivateRoute path="/admin-users" component={UsersContainer} permissions={myPermissions} code="AU" pathto="/access-denied"/>
            <PrivateRoute path="/admin-roles" component={RolesContainer} permissions={myPermissions} code="AR" pathto="/access-denied"/>
            <PrivateRoute path="/admin-permissions" component={PermissionsContainer} permissions={myPermissions} code="AP" pathto="/access-denied"/>
            <PrivateRoute path="/admin-prefmgmt" component={PreferencesContainer} permissions={myPermissions} code="APR" pathto="/access-denied"/>
            <PrivateRoute path="/admin-prefsub" component={PreferenceSubContainer} permissions={myPermissions} code="APR" pathto="/access-denied"/>
            <PrivateRoute path="/admin-language" component={LanguageContainer} permissions={myPermissions} code="AL" pathto="/access-denied"/>
            <PrivateRoute path="/admin-category" component={CategoryContainer} permissions={myPermissions} code="AC" pathto="/access-denied"/>
            <PrivateRoute path="/admin-status" component={StatusContainer} permissions={myPermissions} code="AS" pathto="/access-denied"/>
            <PrivateRoute path="/admin-service" component={ServiceContainer} permissions={myPermissions} code="ASVR" pathto="/access-denied"/>
            <PrivateRoute path="/admin-menu" component={MenuContainer} permissions={myPermissions} code="AM" pathto="/access-denied"/>
            <PrivateRoute path="/admin-system" component={SystemContainer} permissions={myPermissions} code="ASYS" pathto="/access-denied"/>
            <PrivateRoute path="/admin-other" component={SubMenuContainer} permissions={myPermissions} code="AO" pathto="/access-denied"/>
            <PrivateRoute path="/admin-usermgmt" component={UserMgmtContainer} permissions={myPermissions} code="AUM" pathto="/access-denied"/>
          </Switch>
        </AdminView>
      );
    } else {
      return (
        <AdminView> <LoadingView/>
        </AdminView>
      );
    }
  }
}

AdminContainer.propTypes = {
	appPrefs: PropTypes.object.isRequired,
	appMenus: PropTypes.object,
	lang: PropTypes.string,
  session: PropTypes.object,
  member: PropTypes.object,
	actions: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, appMenus:state.appMenus, lang:state.lang, session:state.session, member:state.member};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(adminActions,dispatch) };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AdminContainer));
