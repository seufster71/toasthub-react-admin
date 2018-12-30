/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from './users-actions';
import fuLogger from '../../core/common/fu-logger';
import UsersView from '../../adminView/users/users-view';
import utils from '../../core/common/utils';


class UsersContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_USER",orderCriteria:[{'orderColumn':'ADMIN_USER_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_USER_TABLE_CODE','orderDir':'ASC'}]};
		this.onPageLimitChange = this.onPageLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onFilterClick = this.onFilterClick.bind(this);
	}

	componentDidMount() {
		this.props.actions.initUsers();
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
			let searchCriteria = {'searchValue':this.state['ADMIN_USER_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPaginationClick',msg:"fieldName "+ value});
			let pageLimit = utils.getPageLimit(this.props.appPrefs,this.state,'ADMIN_USER_PAGELIMIT');
			let pageStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_USER_PAGINATION"] != null && this.state["ADMIN_USER_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_USER_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			pageStart = ((segmentValue - 1) * pageLimit);
			this.setState({"ADMIN_USER_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_USER_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
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
			let pageLimit = utils.getPageLimit(this.props.appPrefs,this.state,'ADMIN_USER_PAGELIMIT');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onFilterClick(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onFilterClick',msg:"id " + id});
		};
	}

  render() {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::render',msg:"Hi there"});
			if (this.props.users.items != null) {
	      return (
					<UsersView
					containerState={this.state}
					users={this.props.users}
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

UsersContainer.propTypes = {
	appPrefs: PropTypes.object,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	users: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, users:state.users};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(userActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(UsersContainer);
