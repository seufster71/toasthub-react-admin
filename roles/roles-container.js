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
import * as rolesActions from './roles-actions';
import fuLogger from '../../core/common/fu-logger';
import RolesView from '../../adminView/roles/roles-view';
import RolesModifyView from '../../adminView/roles/roles-modify-view';
import UserRolesModifyView from '../../adminView/roles/user-roles-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';


function RolesContainer() {
	const roles = useSelector((state) => state.roles);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(rolesActions.init(location.state.parent,location.state.parentType));
		} else {
			dispatch(rolesActions.init());
		}
	}, []);

	const getState = () => {
		return roles;
	}
	
	const getForm = () => {
		return "ADMIN_ROLE_FORM";
	}
	
	const onModifyPermissions = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onModifyPermissions',msg:"test"+item.id});
		navigate('/admin-permissions',{state:{parent:item}});
	}
	
	const onUserRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleModify',msg:"test"+item.id});
		if (item.userRole != null) {
			dispatch(rolesActions.modifyUserRole({userRoleId:item.userRole.id,roleId:item.id,appPrefs:appPrefs}));
		} else {
			dispatch(rolesActions.modifyUserRole({roleId:item.id,appPrefs:appPrefs}));
		}
	}
	
	const onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(roles.prefForms.ADMIN_USER_ROLE_FORM,roles.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_NAME'};
			dispatch(rolesActions.saveRolePermission({state:roles}));
		} else {
			dispatch(rolesActions.setErrors({errors:errors.errorMap}));
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
		switch(code) {
			case 'MODIFY_USER_ROLE': {
				onUserRoleModify(item);
				break;
			}
			case 'MODIFY_PERMISSION': {
				onModifyPermissions(item);
				break;
			}
		}
	}
	

	fuLogger.log({level:'TRACE',loc:'RolesContainer::render',msg:"Hi there"});
	if (roles.isModifyOpen) {
		return (
			<RolesModifyView
			itemState={roles}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}
			applicationSelectList={roles.applicationSelectList}/>
		);
	} else if (roles.isUserRoleOpen) {
		return (
			<UserRolesModifyView
			itemState={roles}
			appPrefs={appPrefs}
			onSave={BaseContainer.onUserRoleSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}/>
		);
	} else if (roles.items != null) {
		return (
			<RolesView 
			itemState={roles}
			appPrefs={appPrefs}
			onListLimitChange={BaseContainer.onListLimitChange}
			onSearchChange={BaseContainer.onSearchChange}
			onSearchClick={BaseContainer.onSearchClick}
			onPaginationClick={BaseContainer.onPaginationClick}
			onOrderBy={BaseContainer.onOrderBy}
			closeModal={BaseContainer.closeModal}
			onOption={onOption}
			inputChange={BaseContainer.inputChange}
			goBack={BaseContainer.goBack}
			session={session}
			/>
				
		);
	} else {
		return (<div> Loading... </div>);
	}

}

export default RolesContainer;
