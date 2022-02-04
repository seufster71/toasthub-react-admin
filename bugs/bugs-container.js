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
import * as actions from './bugs-actions';
import fuLogger from '../../core/common/fu-logger';
import BugsLanesView from '../../adminView/bugs/bugs-lanes-view';
import BugsListView from '../../adminView/bugs/bugs-list-view';
import BugsModifyView from '../../adminView/bugs/bugs-modify-view';
import BaseContainer from '../../core/container/base-container';


function BugsContainer() {
	const itemState = useSelector((state) => state.adminbugs);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(actions.init());
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"PM_PROJECT_FORM"});
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
	
	fuLogger.log({level:'TRACE',loc:'BugsContainer::render',msg:"Hi there"});
	if (itemState.isModifyOpen) {
		return (
			<BugsModifyView
			itemState={itemState}
			item={itemState.selected}
			inputFields={itemState.inputFields}
			appPrefs={appPrefs}
			itemPrefForms={prefForms}
			onSave={onSave}
			onCancel={onCancel}
			onReturn={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.items != null) {
		return (
			<BugsListView 
			itemState={itemState}
			appPrefs={appPrefs}
			onListLimitChange={onListLimitChange}
			onSearchChange={onSearchChange}
			onSearchClick={onSearchClick}
			onPaginationClick={onPaginationClick}
			onOrderBy={onOrderBy}
			openDeleteModal={openDeleteModal}
			closeModal={closeModal}
			onModify={onModify}
			onDelete={onDelete}
			inputChange={inputChange}
			session={session}
			/>	
		);
	} else {
		return (<div> Loading... </div>);
	}
}

export default BugsContainer;
