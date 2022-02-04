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
import * as actions from './preferences-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferencesView from '../../adminView/preferences/preferences-view';
import PreferenceModifyView from '../../adminView/preferences/preferences-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Preferences Page
*/
function PreferencesContainer() {
	const itemState = useSelector((state) => state.adminpreferences);
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
		BaseContainer.onSave({state:itemState,actions:actions,dispatch:dispatch,appPrefs:appPrefs,form:"ADMIN_PREFERENCE_FORM"});
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
	
	const openFormView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openFormView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_FORMFIELD_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_FORMFIELD_TABLE_TITLE'}];
		dispatch(actions.initSubView({itemState:preferenceSubView,item,viewType:"FORM",orderCriteria,searchCriteria,listStart:0,listLimit:20}));
	}
	
	const openLabelView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openLabelView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_LABEL_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_LABEL_TABLE_TITLE'}];
		dispatch(actions.initSubView({itemState:preferenceSubView,item,viewType:"LABEL",orderCriteria,searchCriteria,listStart:0,listLimit:20}));
	}
	
	const openTextView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openTextView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_TEXT_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_TEXT_TABLE_TITLE'}];
		dispatch(actions.initSubView({itemState:preferenceSubView,item,viewType:"TEXT",orderCriteria,searchCriteria,listStart:0,listLimit:20}));
	}
	
	const openOptionView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openOptionView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_OPTION_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_OPTION_TABLE_TITLE'}];
		dispatch(actions.initSubView({itemState:preferenceSubView,item,viewType:"OPTION",orderCriteria,searchCriteria,listStart:0,listLimit:20}));
	}
	
	const onMoveSelect = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSelect',msg:"test"});
		if (item != null) {
			dispatch(actions.moveSelect({state:itemState,stateSubView:preferenceSubView,item}));
		}
	}
	
	const onMoveSave = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSave',msg:"test"});
		if (item != null) {
			dispatch(actions.moveSave({state:itemState,code,item,stateSubView:preferenceSubView}));
		}
	}
	
	const onMoveCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveCancel',msg:"test"});
		dispatch(actions.moveCancel({state:itemState,stateSubView:preferenceSubView}));
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
			return;
		}
		
		switch(code) {
			case 'SHOW_FORMFIELDS': {
				navigate('/admin-prefsub',{state:{parent:item,subType:"FORM"}});
				break;
			}
			case 'SHOW_LABELS': {
				navigate('/admin-prefsub',{state:{parent:item,subType:"LABEL"}});
				break;
			}
			case 'SHOW_TEXTS': {
				navigate('/admin-prefsub',{state:{parent:item,subType:"TEXT"}});
				break;
			}
			case 'SHOW_OPTIONS': {
				navigate('/admin-prefsub',{state:{parent:item,subType:"OPTION"}});
				break;
			}
			case 'MOVESELECT': {
				onMoveSelect(item);
				break;
			}
			case 'MOVEABOVE': {
				onMoveSave(code,item);
				break;
			}
			case 'MOVEBELOW': {
				onMoveSave(code,item);
				break;
			}
			case 'MOVECANCEL': {
				onMoveCancel();
				break;
			}
		}
	}

	fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"test "});
	if (itemState.isModifyOpen) {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceModifyView"});
		return (
			<PreferenceModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			/>
		);
	} else if (itemState.items != null) {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceView"});
		return (
			<PreferencesView
			itemState={itemState}
			appPrefs={appPrefs}
			onListLimitChange={onListLimitChange}
			onSearchChange={onSearchChange}
			onSearchClick={onSearchClick}
			onPaginationClick={onPaginationClick}
			onOrderBy={onOrderBy}
			onOption={onOption}
			closeModal={closeModal}
			inputChange={inputChange}
			openFormView={openFormView}
			openLabelView={openLabelView}
			openTextView={openTextView}
			openOptionView={openOptionView}
			session={session}/>
		);
	} else {
		return (<div> Loading </div>);
	}
}

export default PreferencesContainer;
