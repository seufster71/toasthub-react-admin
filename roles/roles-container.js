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
import * as actions from './roles-actions';
import fuLogger from '../../core/common/fu-logger';
import RolesView from '../../adminView/roles/roles-view';
import RolesModifyView from '../../adminView/roles/roles-modify-view';
import UserRolesModifyView from '../../adminView/roles/user-roles-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';


function RolesContainer() {
	const itemState = useSelector((state) => state.adminroles);
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
		BaseContainer.onSearchChange({state:itemState,actions:actions,dispatch:dispatch,field,event});
	}
	const onSearchClick = (fieldName,event) => {
		BaseContainer.onSearchClick({state:itemState,actions:actions,dispatch:dispatch,fieldName,event});
	}
	const inputChange = (type,field,value,event) => {
		BaseContainer.inputChange({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,type,field,value,event});
	}
	const onOrderBy = (selectedOption, event) => {
		BaseContainer.onOrderBy({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,selectedOption,event});
	}
	const onSave = () => {
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"ADMIN_ROLE_FORM"});
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
	
	const onModifyPermissions = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onModifyPermissions',msg:"test"+item.id});
		navigate('../permissions',{state:{parent:item}});
	}
	
	const onUserRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleModify',msg:"test"+item.id});
		if (item.userRole != null) {
			dispatch(actions.modifyUserRole({userRoleId:item.userRole.id,roleId:item.id,appPrefs:appPrefs}));
		} else {
			dispatch(actions.modifyUserRole({roleId:item.id,appPrefs:appPrefs}));
		}
	}
	
	const onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(itemState.prefForms.ADMIN_USER_ROLE_FORM,itemState.inputFields, appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			dispatch(actions.saveRolePermission({state:itemState}));
		} else {
			dispatch(actions.setStatus({errors:errors.errorMap}));
		}
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
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
	if (itemState.view == "MODIFY") {
		return (
			<RolesModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			applicationSelectList={itemState.applicationSelectList}/>
		);
	} else if (itemState.view == "USER_ROLE_MODIFY") {
		return (
			<UserRolesModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onUserRoleSave}
			onCancel={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<RolesView 
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

export default RolesContainer;
