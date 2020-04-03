/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from "react-router";
import * as appPrefActions from '../../core/common/apppref-actions';
import fuLogger from '../../core/common/fu-logger';
import SubMenuView from '../../adminView/submenu/submenu-view';


class SubMenuContainer extends Component {
	constructor(props) {
		super(props);
		this.changeTab = this.changeTab.bind(this);
	}

	componentDidMount() {
		//this.props.actions.initMember();
	}

	changeTab(index) {
			this.props.history.replace(index);
	}

  render() {
			fuLogger.log({level:'TRACE',loc:'SubMenuContainer::render',msg:"Hi there"});
			const path = this.props.history.location.pathname;
			let topMenus = this.props.appMenus[this.props.appPrefs.adminMenu];
			let children = [];
			if (topMenus != null) {
				for (let m = 0; m < topMenus.length; m++) {
					if (topMenus[m].values[0].rendered) {
						if (path.includes(topMenus[m].values[0].href)){
							if (topMenus[m].children != null && topMenus[m].children.length > 0){
								children = topMenus[m].children;
							}
						}
					}
				}
			}
      return (
				<SubMenuView menus={children} changeTab={this.changeTab}/>
			);
  }
}

SubMenuContainer.propTypes = {
	appMenus: PropTypes.object,
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	actions: PropTypes.object,
	history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appMenus:state.appMenus, lang:state.lang, appPrefs:state.appPrefs};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(appPrefActions,dispatch) };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(SubMenuContainer));
