/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from './user-actions';
import fuLogger from '../../core/common/fu-logger';
import UsersView from '../../adminView/users/users-view';


class UsersContainer extends Component {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		this.props.actions.initUsers();
	}

  render() {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::render',msg:"Hi there"});
      return (
				<UsersView/>
			);
  }
}

UsersContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(userActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(UsersContainer);
