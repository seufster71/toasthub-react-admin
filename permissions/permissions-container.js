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
import { useNavigate, useLocation } from "react-router-dom";
import * as actions from './permissions-actions';
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
	const itemState = useSelector((state) => state.adminpermissions);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(actions.init({parent:location.state.parent,parentType:location.state.parentType}));
		} else {
			dispatch(actions.init({}));
		}
	}, []);
	
	const onListLimitChange = (fieldName,event) => {
		BaseContainer.onListLimitChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,fieldName,event});
	}
	const onPaginationClick = (value) => {
		BaseContainer.onPaginationClick({state:itemState,actions:actions,dispatch:dispatch,value});
	}
	const onSearchChange = (field,event) => {
		BaseContainer.onSearchChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,field,event});
	}
	const onSearchClick = (field,event) => {
		BaseContainer.onSearchClick({state:itemState,actions:actions,dispatch:dispatch,field,event});
	}
	const inputChange = (type,field,value,event) => {
		BaseContainer.inputChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,type,field,value,event});
	}
	const onOrderBy = (field, event) => {
		BaseContainer.onOrderBy({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,field,event});
	}
	const onSave = () => {
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"ADMIN_PERMISSION_FORM"});
	}
	const closeModal = () => {
		BaseContainer.closeModal({actions:actions,dispatch:dispatch});
	}
	const onCancel = () => {
		BaseContainer.onCancel({state:itemState,actions:actions,dispatch:dispatch});
	}
	const goBack = () => {
		BaseContainer.goBack({navigate});
	}
	const onBlur = (field) => {
		BaseContainer.onCancel({state:itemState,actions:actions,dispatch:dispatch,field});
	}
	
	const onRolePermissionModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionModify',msg:"test"+item.id});
		if (item.rolePermission != null) {
			dispatch(actions.modifyRolePermission({rolePermissionId:item.rolePermission.id,permissionId:item.id}));
		} else {
			dispatch(actions.modifyRolePermission({permissionId:item.id,appPrefs:appPrefs}));
		}
	}
	
	const onRolePermissionSave = () => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionSave',msg:"test"});
		let errors = utils.validateFormFields(itemState.prefForms.ADMIN_ROLE_PERMISSION_FORM,itemState.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			dispatch(actions.saveRolePermission({state:itemState}));
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
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
	if (itemState.view == "MODIFY") {
		return (
			<PermissionsModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			applicationSelectList={itemState.applicationSelectList}/>
		);
	} else if (itemState.view == "ROLE_PERMISSION_MODIFY") {
		return (
			<RolePermissionsModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onRolePermissionSave}
			onCancel={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<PermissionsView 
			itemState={itemState}
			appPrefs={appPrefs}
			onListLimitChange={onListLimitChange}
			onSearchChange={onSearchChange}
			onSearchClick={onSearchClick}
			onPaginationClick={onPaginationClick}
			onOrderBy={onOrderBy}
			closeModal={closeModal}
			onOption={onOption}
			inputChange={inputChange}
			goBack={goBack}
			session={session}
			/>
				
		);
	} else {
		return (<div> Loading... </div>);
	}
}

export default PermissionsContainer;
