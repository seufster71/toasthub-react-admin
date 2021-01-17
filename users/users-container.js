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
import BaseContainer from '../../core/container/base-container';

class UsersContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.actions.init();
	}

	getState = () => {
		return this.props.users;
	}
	
	getForm = () => {
		return "ADMIN_USER_FORM";
	}	
	
	onModifyRoles = (item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onModifyRoles',msg:"test"+item.id});
		this.props.history.push({pathname:'/admin-roles',state:{parent:item}});
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
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
		this.props.actions.setErrors({errors:null, successes:null});
		this.props.actions.clearField('ADMIN_USER_FORM_VERIFY_PASSWORD');
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::render',msg:"Hi there"});
		if (this.props.users.isModifyOpen) {
			return (
				<UsersModifyView
				itemState={this.props.users}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				onBlur={this.onBlur}/>
			);
		} else if (this.props.users.items != null) {
			return (
				<UsersView
				itemState={this.props.users}
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
