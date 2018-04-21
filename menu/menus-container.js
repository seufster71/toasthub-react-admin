/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as menusActions from './menus-actions';
import fuLogger from '../../core/common/fu-logger';
import MenuView from '../../adminView/menu/menu-view';


class MenuContainer extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.props.actions.initMenus();
	}

	onClick(code,index) {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onClick',msg:"clicked " + code});

	}

  render() {
			fuLogger.log({level:'TRACE',loc:'MenuContainer::render',msg:"Hi there"});
      return (
				<MenuView menus={this.props.menus}/>
			);
  }
}

MenuContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	menus: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs, menus:state.menus};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(menusActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(MenuContainer);
