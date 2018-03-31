/*
* Author Edward Seufert
*/
'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Switch, Route, withRouter, Redirect} from "react-router-dom";
import * as navActions from '../core/navigation/nav-actions';
import * as appPrefActions from '../core/common/apppref-actions';
import LoginContainer from '../core/usermanagement/login-container';
import StatusView from '../coreView/status/status-view';
import NavigationView from '../adminView/navigation/navigation-view';
import UsersContainer from './users/users-container';
import BugsContainer from './bugs/bugs-container';
import ChangeRequestsContainer from './changerequests/changerequests-container';
import PreferencesContainer from './preferences/preferences-container';
import SubmenuContainer from './submenu/submenu-container';
import AdminView from '../adminView/admin-view';
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

  changeTab(tabIndex) {
    return (event) => {
      fuLogger.log({level:'TRACE',loc:'AdminContainer::changeTab',msg:"index " + tabIndex});
      this.setState({'activeTab':tabIndex});
    };
  }

  render() {
    fuLogger.log({level:'TRACE',loc:'AdminContainer::render',msg:"page"});
    let container;
    switch(this.state.activeTab) {
      case "USERS":
        container = <UsersContainer/>;
        break;
      case "PREFERENCES":
        container = <PreferencesContainer/>;
        break;
      case "BUGS":
        container = <BugsContainer/>;
        break;
      case "SUBMENU":
        container = <SubmenuContainer/>;
        break;
      default:
        container = <ChangeRequestsContainer/>;
    }
    return (
      <AdminView>
        <NavigationView
        appPrefs={this.props.appPrefs}
        menus={this.props.appMenus.MEMBER_MENU_TOP}
        activeTab={this.state.activeTab} />
        <StatusView/>
        <Switch>
          <Route path="/admin" component={UsersContainer}/>
          <Route path="/admin-preferences" component={PreferencesContainer}/>
          <Route path="/admin-bugs" component={BugsContainer}/>
          <Route path="/member-changerequests" component={ChangeRequestsContainer}/>
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
	actions: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appMenus:state.appMenus, lang:state.lang, appPrefs:state.appPrefs, navigation:state.navigation, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(Object.assign({}, navActions, appPrefActions),dispatch) };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AdminContainer));
