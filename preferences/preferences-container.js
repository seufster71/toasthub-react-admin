/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from "react-router";
import * as preferencesActions from './preferences-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferencesView from '../../adminView/preferences/preferences-view';
import utils from '../../core/common/utils';


class PreferencesContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_PREFERENCE",orderCriteria:[{'orderColumn':'ADMIN_PREFERENCE_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_PREFERENCE_TABLE_CODE','orderDir':'ASC'}]};
		this.onPageLimitChange = this.onPageLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onFilterClick = this.onFilterClick.bind(this);
	}

	componentDidMount() {
		let orderCriteria = this.state.orderCriteria;
		this.props.actions.initPreferences(orderCriteria);
	}

	onPageLimitChange(fieldName) {
		return (event) => {
			let value = 20;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
				this.setState({[fieldName]:parseInt(event.nativeEvent.text)});
			} else {
				value = event.target.value;
				this.setState({[fieldName]:parseInt(event.target.value)});
			}

			let pageStart = 0;
			let pageLimit = parseInt(value);
//			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPageLimitChange',msg:"pageLimit " + pageLimit});
			let searchCriteria = {'searchValue':this.state['ADMIN_PREFERENCE_SEARCH_input'],'searchColumn':'ADMIN_PREFERENCE_TABLE_DESC'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPaginationClick',msg:"fieldName "+ value});
			let pageLimit = utils.getPageLimit(this.props.appPrefs,this.state,'ADMIN_PREFERENCE_PAGELIMIT');
			let pageStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_PREFERENCE_PAGINATION"] != null && this.state["ADMIN_PREFERENCE_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_PREFERENCE_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			pageStart = ((segmentValue - 1) * pageLimit);
			this.setState({"ADMIN_PREFERENCE_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_PREFERENCE_SEARCH_input'],'searchColumn':'ADMIN_PREFERENCE_TABLE_DESC'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onSearchChange(fieldName) {
		return (event) => {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		};
	}

	onSearchClick(e) {
		return (event) => {
			let fieldName = "";
			if (this.props.codeType === 'NATIVE') {
				fieldName = e;
			} else {
				event.preventDefault();
				fieldName = event.target.id;
			}
		//	fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSearchClick',msg:"the state " + JSON.stringify(this.state)});
			let pageStart = 0;
			let pageLimit = utils.getPageLimit(this.props.appPrefs,this.state,'ADMIN_PREFERENCE_PAGELIMIT');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_PREFERENCE_TABLE_DESC'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onFilterClick(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onFilterClick',msg:"id " + id});
			jQuery('#filterModal').modal({backdrop:"static",show:true});
		};
	}

  render() {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"test " + JSON.stringify(this.state)});
		if (this.props.preferences.items != null) {
      return (
				<PreferencesView
				containerState={this.state}
				preferences={this.props.preferences}
				appPrefs={this.props.appPrefs}
				onPageLimitChange={this.onPageLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onFilterClick={this.onFilterClick}/>
			);
		} else {
			return (<div> Loading </div>);
		}
  }
}

PreferencesContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	codeType: PropTypes.string,
	preferences: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs, preferences:state.preferences};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(preferencesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PreferencesContainer);
