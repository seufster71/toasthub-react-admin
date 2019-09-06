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
		this.state = {pageName:"ADMIN_USER",orderCriteria:[{'orderColumn':'ADMIN_USER_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_USER_TABLE_CODE','orderDir':'ASC'}],
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSaveUser = this.onSaveUser.bind(this);
		this.onDeleteUser = this.onDeleteUser.bind(this);
		this.inputChange = this.inputChange.bind(this);
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
	
	onSaveUser() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onSaveUser',msg:"test"});

			if (this.props.users.selectedUser != null && this.props.users.selectedUser.firstName != "" && this.props.users.selectedUser.lastName != "" && this.props.users.selectedUser.userName != ""
				&& this.props.users.selectedUser.email != "" && this.props.users.selectedUser.supervisorId > 0 && this.props.users.selectedUser.departmentId > 0 && this.props.users.selectedUser.birthDate != ""
					&& this.props.users.selectedUser.hireDate != ""){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['USERS_SEARCH_input'],'searchColumn':'USER_TABLE_FIRSTNAME'};
				this.props.actions.saveUser(this.props.users.selectedUser,this.props.users.listStart,this.props.users.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.users.selectedUser == null || this.props.users.selectedUser.firstName == null || this.props.users.selectedUser.firstName == "" ){
					errors.USER_FIRSTNAME_input = "Missing!";
				}
				if (this.props.users.selectedUser == null || this.props.users.selectedUser.lastName == null || this.props.users.selectedUser.lastName == "") {
					errors.USER_LASTNAME_input = "Missing!";
				}
				if (this.props.users.selectedUser == null || this.props.users.selectedUser.userName == null || this.props.users.selectedUser.userName == "") {
					errors.USER_USERNAME_input = "Missing!";
				}
				if (this.props.users.selectedUser == null || this.props.users.selectedUser.email == null || this.props.users.selectedUser.email == "") {
					errors.USER_EMAIL_input = "Missing!";
				}
				if (this.props.users.selectedUser == null || isNaN(this.props.users.selectedUser.supervisorId) || this.props.users.selectedUser.supervisorId == 0) {
					errors.supervisorId = "Missing!";
				}
				if (this.props.users.selectedUser == null || isNaN(this.props.users.selectedUser.departmentId) || this.props.users.selectedUser.departmentId == 0) {
					errors.departmentId = "Missing!";
				}
				if (this.props.users.selectedUser == null || this.props.users.selectedUser.birthDate == null || this.props.users.selectedUser.birthDate == "") {
					errors.BIRTH_DATE_input = "Missing!";
				}
				if (this.props.users.selectedUser == null || this.props.users.selectedUser.hireDate == null || this.props.users.selectedUser.hireDate == "") {
					errors.HIRE_DATE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onDeleteUser(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::onDeleteUser',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['USERS_SEARCH_input'],'searchColumn':'USER_TABLE_FIRSTNAME'};
			this.props.actions.deleteUser(id,this.props.users.listStart,this.props.users.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openEditModal(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'UsersContainer::openEditModal',msg:"id " + id});
			this.setState({isEditModalOpen:true});
			this.props.actions.usersPage();
			if (id != null) {
				this.props.actions.user(id);
			} else {
				this.props.actions.clearUser();
			}
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedUserId:id,selectedUserName:name});
		}
	}
	
	closeModal() {
		return (event) => {
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false,errors:{}});
		};
	}
	
	inputChange(fieldName) {
		return (event) => {
			let	value = event.target.value;
			this.props.actions.inputChange(fieldName,value);
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
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openEditModal={this.openEditModal}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onSaveUser={this.onSaveUser}
				onDeleteUser={this.onDeleteUser}
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
