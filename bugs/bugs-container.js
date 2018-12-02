/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appPrefActions from './bugs-actions';
import fuLogger from '../../core/common/fu-logger';
import BugsView from '../../adminView/bugs/bugs-view';


class BugsContainer extends Component {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		this.props.actions.initBugs();
	}

	onClick(code,index) {
		fuLogger.log({level:'TRACE',loc:'BugsContainer::onClick',msg:"clicked " + code});

	}

  render() {
			fuLogger.log({level:'TRACE',loc:'BugsContainer::render',msg:"Hi there"});
      return (
				<BugsView bugs={this.props.bugs}/>
			);
  }
}

BugsContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	bugs: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs, bugs:state.bugs};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(appPrefActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(BugsContainer);
