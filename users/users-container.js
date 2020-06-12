/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
		this.state = {pageName:"ADMIN_USER",isDeleteModalOpen: false, errors:null, warns:null, successes:null};

	}

	componentDidMount() {
		this.props.actions.init();
	}

	onListLimitChange = (fieldName, event) => {
		let value = 20;
		if (this.props.codeType === 'NATIVE') {
			value = event.nativeEvent.text;
		} else {
			value = event.target.value;
		}

		let listLimit = parseInt(value);
		this.props.actions.listLimit({state:this.props.users,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.users.listStart;
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
		listStart = ((segmentValue - 1) * this.props.users.listLimit);
		this.setState({"ADMIN_USER_PAGINATION":segmentValue});
		
		this.props.actions.list({state:this.props.users,listStart});
	}

	onSearchChange = (fieldName, event) => {
		if (event.type === 'keypress') {
			if (event.key === 'Enter') {
				this.searchClick(fieldName,event);
			}
		} else {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		}
	}

	onSearchClick = (fieldName, event) => {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_USER-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_USER-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.users.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_USER-SEARCH'];
				option.searchColumn = this.props.users.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.users,searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'UserContainer::onOrderBy',msg:"id " + selectedOption});
		let orderCriteria = [];
		if (event != null) {
			for (let o = 0; o < event.length; o++) {
				let option = {};
				if (event[o].label.includes("ASC")) {
					option.orderColumn = event[o].value;
					option.orderDir = "ASC";
				} else if (event[o].label.includes("DESC")){
					option.orderColumn = event[o].value;
					option.orderDir = "DESC";
				} else {
					option.orderColumn = event[o].value;
				}
				orderCriteria.push(option);
			}
		} else {
			let option = {orderColumn:"ADMIN_USER_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.users,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.users.prefForms.ADMIN_USER_FORM,this.props.users.inputFields);
		
		if (errors.isValid){
			this.props.actions.saveUser({state:this.props.users});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onModify',msg:"test"+id});
		this.props.actions.user(id);
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onDelete',msg:"test"});
		this.setState({isDeleteModalOpen:false});
		if (item != null && item.id != "") {
			this.props.actions.deleteUser({state:this.props.users,id:item.id});
		}
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	onModifyRoles = (item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onModifyRoles',msg:"test"+item.id});
		this.props.history.push({pathname:'/admin-roles',state:{parent:item}});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.users});
	}
	
	inputChange = (fieldName,switchValue) => {
		utils.inputChange(this.props,fieldName,switchValue);
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onOption',msg:" code "+code});
		switch(code) {
			case 'MODIFY': {
				this.onModify(item);
				break;
			}
			case 'DELETE': {
				this.openDeleteModal(item);
				break;
			}
			case 'DELETEFINAL': {
				this.onDelete(item);
				break;
			}
			case 'MODIFY_ROLE': {
				this.onModifyRoles(item);
				break;
			}
		}
	}
	
	onBlur = (field) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onBlur',msg:field.name});
		let fieldName = field.name;
		// get field and check what to do
		if (field.optionalParams != ""){
			let optionalParams = JSON.parse(field.optionalParams);
			if (optionalParams.onBlur != null) {
				if (optionalParams.onBlur.validation != null && optionalParams.onBlur.validation == "matchField") {
					if (field.validation != "") {
						let validation = JSON.parse(field.validation);
						if (validation[optionalParams.onBlur.validation] != null && validation[optionalParams.onBlur.validation].id != null){
							if (this.props.users.inputFields[validation[optionalParams.onBlur.validation].id] == this.props.users.inputFields[fieldName]) {
								if (validation[optionalParams.onBlur.validation].successMsg != null) {
									let successMap = this.state.successes;
									if (successMap == null){
										successMap = {};
									}
									successMap[fieldName] = validation[optionalParams.onBlur.validation].successMsg;
									this.setState({successes:successMap, errors:null});
								}
							} else {
								if (validation[optionalParams.onBlur.validation].failMsg != null) {
									let errorMap = this.state.errors;
									if (errorMap == null){
										errorMap = {};
									}
									errorMap[fieldName] = validation[optionalParams.onBlur.validation].failMsg;
									this.setState({errors:errorMap, successes:null});
								}
							}
						}
					}
				} else if (optionalParams.onBlur.func != null) {
					if (optionalParams.onBlur.func == "clearVerifyPassword"){
						this.clearVerifyPassword();
					}
				}
			}
		}
	}
	
	clearVerifyPassword = () => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::clearVerifyPassword',msg:"Hi there"});
		this.setState({errors:null, successes:null});
		this.props.actions.clearField('ADMIN_USER_FORM_VERIFY_PASSWORD');
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::render',msg:"Hi there"});
		if (this.props.users.isModifyOpen) {
			return (
				<UsersModifyView
				containerState={this.state}
				item={this.props.users.selected}
				inputFields={this.props.users.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.users.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				onBlur={this.onBlur}/>
			);
		} else if (this.props.users.items != null) {
			return (
				<UsersView
				containerState={this.state}
				items={this.props.users}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				session={this.props.session}
				/>
			);
		} else {
			return (<div> Loading... </div>);
		}
	}
}

UsersContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	users: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, users:state.users, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(userActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(UsersContainer);
