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
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import * as userActions from './users-actions';
import fuLogger from '../../core/common/fu-logger';
import UsersView from '../../adminView/users/users-view';
import UsersModifyView from '../../adminView/users/users-modify-view';
import BaseContainer from '../../core/container/base-container';

function UsersContainer() {
	const users = useSelector((state) => state.users);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(userActions.init());
	}, []);

	const getState = () => {
		return users;
	}
	
	const getForm = () => {
		return "ADMIN_USER_FORM";
	}	
	
	const onModifyRoles = (item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onModifyRoles',msg:"test"+item.id});
		navigate('/admin-roles',{state:{parent:item}});
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'MODIFY_ROLE': {
				onModifyRoles(item);
				break;
			}
		}
	}
	
	const onBlur = (field) => {
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
							if (users.inputFields[validation[optionalParams.onBlur.validation].id] == users.inputFields[fieldName]) {
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
						clearVerifyPassword();
					}
				}
			}
		}
	}
	
	clearVerifyPassword = () => {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::clearVerifyPassword',msg:"Hi there"});
		dispatch(userActions.setErrors({errors:null, successes:null}));
		dispatch(userActions.clearField('ADMIN_USER_FORM_VERIFY_PASSWORD'));
	}

	fuLogger.log({level:'TRACE',loc:'UsersContainer::render',msg:"Hi there"});
	if (users.isModifyOpen) {
		return (
			<UsersModifyView
			itemState={users}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}
			onBlur={onBlur}/>
		);
	} else if (users.items != null) {
		return (
			<UsersView
			itemState={users}
			appPrefs={appPrefs}
			onListLimitChange={BaseContainer.onListLimitChange}
			onSearchChange={BaseContainer.onSearchChange}
			onSearchClick={BaseContainer.onSearchClick}
			onPaginationClick={BaseContainer.onPaginationClick}
			onOrderBy={BaseContainer.onOrderBy}
			closeModal={BaseContainer.closeModal}
			onOption={onOption}
			inputChange={BaseContainer.inputChange}
			session={session}
			/>
		);
	} else {
		return (<div> Loading... </div>);
	}
}

export default UsersContainer;
