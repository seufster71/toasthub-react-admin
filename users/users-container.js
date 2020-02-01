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
import UsersModifyView from '../../adminView/users/users-modify-view';
import utils from '../../core/common/utils';


class UsersContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_USER",orderCriteria:[{'orderColumn':'ADMIN_USER_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_USER_TABLE_CODE','orderDir':'ASC'}],
			isDeleteModalOpen: false, errors:null, warns:null, successes:null};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onModify = this.onModify.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onEditRoles = this.onEditRoles.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentDidMount() {
		this.props.actions.init();
	}

	onListLimitChange(fieldName) {
		return (event) => {
			let value = 20;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
				this.setState({[fieldName]:parseInt(event.nativeEvent.text)});
			} else {
				value = event.target.value;
				this.setState({[fieldName]:parseInt(event.target.value)});
			}

			let listStart = 0;
			let listLimit = parseInt(value);
//			fuLogger.log({level:'TRACE',loc:'UsersContainer::onListLimitChange',msg:"listLimit " + listLimit});
			let searchCriteria = {'searchValue':this.state['ADMIN_USER_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_USER_ListLimit');
			let listStart = 0;
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
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_USER_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_USER_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
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
		//	fuLogger.log({level:'TRACE',loc:'UsersContainer::onSearchClick',msg:"the state " + JSON.stringify(this.state)});
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_USER_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onSave',msg:"test"});
			let errors = utils.validateFormFields(this.props.users.appForms.ADMIN_USER_FORM,this.props.users.inputFields);
			
			if (errors.isValid){
				let searchCriteria = {'searchValue':this.state['ADMIN_USERS_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_FIRSTNAME'};
				this.props.actions.saveUser(this.props.users.inputFields,this.props.users.listStart,this.props.users.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				this.setState({errors:errors.errorMap});
			}
		};
	}
	
	onModify(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onModify',msg:"test"+id});
			this.props.actions.user(id);
		};
	}
	
	onDelete(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onDelete',msg:"test"+id});
			this.setState({isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['ADMIN_USERS_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_FIRSTNAME'};
			this.props.actions.deleteUser(id,this.props.users.listStart,this.props.users.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedUserId:id,selectedUserName:name});
		}
	}
	
	onEditRoles(item) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onEditRoles',msg:"test"+item.id});
			this.props.history.push({pathname:'/admin-roles',state:{parent:item}});
		};
	}
	
	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}
	
	onCancel() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onCancel',msg:"test"});
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_USER_ListLimit');
			let searchCriteria = {'searchValue':this.state['ADMIN_USER_SEARCH_input'],'searchColumn':'ADMIN_USER_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	inputChange(fieldName,switchValue) {
		return (event) => {
			let	value = null;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
			} else {
				value = event.target.value;
			}
			if (switchValue != null) {
				value = switchValue;
			}
			this.props.actions.inputChange(fieldName,value);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::render',msg:"Hi there"});
		if (this.props.users.isModifyOpen) {
			return (
				<UsersModifyView
				containerState={this.state}
				user={this.props.users.selectedUser}
				inputFields={this.props.users.inputFields}
				appPrefs={this.props.appPrefs}
				userAppForms={this.props.users.appForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.users.items != null) {
			return (
				<UsersView
				containerState={this.state}
				users={this.props.users}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openDeleteModal={this.openDeleteModal}
				closeModal={this.closeModal}
				onModify={this.onModify}
				onDelete={this.onDelete}
				onEditRoles={this.onEditRoles}
				inputChange={this.inputChange}/>
			);
		} else {
			return (<div> Loading... </div>);
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
