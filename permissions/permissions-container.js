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
import * as permissionsActions from './permissions-actions';
import fuLogger from '../../core/common/fu-logger';
import utils from '../../core/common/utils';
import PermissionsView from '../../adminView/permissions/permissions-view';
import PermissionsModifyView from '../../adminView/permissions/permissions-modify-view';
import RolePermissionsModifyView from '../../adminView/permissions/role-permissions-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Permission Page
*/
function PermissionsContainer() {
	const permissions = useSelector((state) => state.permissions);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(permissionsActions.init(location.state.parent,location.state.parentType));
		} else {
			dispatch(permissionsActions.init());
		}
	}, []);
	
	const getState = () => {
		return permissions;
	}
	
	const getForm = () => {
		return "ADMIN_PERMISSION_FORM";
	}	
	
	const onRolePermissionModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionModify',msg:"test"+item.id});
		if (item.rolePermission != null) {
			dispatch(permissionsActions.modifyRolePermission({rolePermissionId:item.rolePermission.id,permissionId:item.id}));
		} else {
			dispatch(permissionsActions.modifyRolePermission({permissionId:item.id,appPrefs:appPrefs}));
		}
	}
	
	const onRolePermissionSave = () => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionSave',msg:"test"});
		let errors = utils.validateFormFields(permissions.prefForms.ADMIN_ROLE_PERMISSION_FORM,permissions.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			dispatch(permissionsActions.saveRolePermission({state:permissions}));
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'MODIFY_ROLE_PERMISSION': {
				onRolePermissionModify(item);
				break;
			}
		}
	}

	fuLogger.log({level:'TRACE',loc:'PermissionsContainer::render',msg:"Hi there"});
	if (permissions.isModifyOpen) {
		return (
			<PermissionsModifyView
			itemState={permissions}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}
			applicationSelectList={permissions.applicationSelectList}/>
		);
	} else if (permissions.isRolePermissionOpen) {
		return (
			<RolePermissionsModifyView
			itemState={permissions}
			appPrefs={appPrefs}
			onSave={onRolePermissionSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}/>
		);
	} else if (permissions.items != null) {
		return (
			<PermissionsView 
			itemState={permissions}
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

export default PermissionsContainer;
