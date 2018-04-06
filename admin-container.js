/*
* Author Edward Seufert
*/
'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Switch, Route, withRouter, Redirect} from "react-router";
import * as navActions from '../core/navigation/nav-actions';
import * as appPrefActions from '../core/common/apppref-actions';
import LoginContainer from '../core/usermanagement/login-container';
import StatusView from '../coreView/status/status-view';
import NavigationView from '../coreView/navigation/navigation-view';
import DashboardContainer from './dashboard/dashboard-container';
import BugsContainer from './bugs/bugs-container';
import ChangeRequestsContainer from './changerequests/changerequests-container';
import PrefMgmtContainer from './prefmgmt/prefmgmt-container';
import PreferencesContainer from './preferences/preferences-container';
import SubMenuContainer from './submenu/submenu-container';
import UsersContainer from './users/users-container';
import RolesContainer from './roles/roles-container';
import PermissionsContainer from './permissions/permissions-container';
import LanguageContainer from './language/language-container';
import CategoryContainer from './category/category-container';
import StatusContainer from './status/status-container';
import ServiceContainer from './service/service-container';
import MenuContainer from './menu/menu-container';
import SystemContainer from './system/system-container';
import AdminView from '../adminView/admin-view';
import UserMgmtContainer from './usermgmt/usermgmt-container';
import fuLogger from '../core/common/fu-logger';

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
      this.setState({activeTab:code});
      this.props.history.replace("/"+index);
  }

  render() {
    fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"path "+ this.props.history.location.pathname});

    let myMenus = [];
    if (this.props.appMenus != null && this.props.appMenus[this.props.appPrefs.adminMenu] != null) {
      myMenus = this.props.appMenus[this.props.appPrefs.adminMenu];
    }
    //fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"menus "+ JSON.stringify(myMenus)});
    return (
      <AdminView>
        <NavigationView menus={myMenus} changeTab={this.changeTab} activeTab={this.state.activeTab} backToTab={"member"}/>
        <StatusView/>
        <Switch>
          <Route path="/admin" component={DashboardContainer}/>
          <Route path="/admin-bugs" component={BugsContainer}/>
          <Route path="/admin-changerequests" component={ChangeRequestsContainer}/>
          <Route path="/admin-users" component={UsersContainer}/>
          <Route path="/admin-roles" component={RolesContainer}/>
          <Route path="/admin-permissions" component={PermissionsContainer}/>
          <Route path="/admin-prefmgmt" component={PrefMgmtContainer}/>
          <Route path="/admin-prefpublic" component={PreferencesContainer}/>
          <Route path="/admin-prefmember" component={PreferencesContainer}/>
          <Route path="/admin-prefadmin" component={PreferencesContainer}/>
          <Route path="/admin-language" component={LanguageContainer}/>
          <Route path="/admin-category" component={CategoryContainer}/>
          <Route path="/admin-status" component={StatusContainer}/>
          <Route path="/admin-service" component={ServiceContainer}/>
          <Route path="/admin-menu" component={MenuContainer}/>
          <Route path="/admin-system" component={SystemContainer}/>
          <Route path="/admin-other" component={SubMenuContainer}/>
          <Route path="/admin-usermgmt" component={UserMgmtContainer}/>
        </Switch>
      </AdminView>
    );
  }
}

AdminContainer.propTypes = {
	appPrefs: PropTypes.object.isRequired,
	navigation: PropTypes.object.isRequired,
	appMenus: PropTypes.object,
	lang: PropTypes.string,
  session: PropTypes.object,
	actions: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appMenus:state.appMenus, lang:state.lang, appPrefs:state.appPrefs, navigation:state.navigation, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(Object.assign({}, navActions, appPrefActions),dispatch) };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AdminContainer));
