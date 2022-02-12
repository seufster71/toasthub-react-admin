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
import * as actions from './language-actions';
import fuLogger from '../../core/common/fu-logger';
import LanguageView from '../../adminView/language/language-view';
import LanguageModifyView from '../../adminView/language/language-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Language Page
*/
function LanguageContainer() {
	const itemState = useSelector((state) => state.adminlanguage);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(actions.init({}));
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"ADMIN_LANGUAGE_FORM"});
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
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'LanguageContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
	}

	fuLogger.log({level:'TRACE',loc:'LanguageContainer::render',msg:"Hi there"});
	if (itemState.view == "MODIFY") {
		return (
			<LanguageModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		return (
			<LanguageView 
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
			session={session}
			/>	
		);
	} else {
		return (<div> Loading... </div>);
	}
}

export default LanguageContainer;
