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
import * as preferencesActions from './preferences-sub-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferenceSubView from '../../adminView/preferences/preferences-sub-view';
import PreferenceSubModifyView from '../../adminView/preferences/preferences-sub-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';

/*
* Preference Sub Page
*/
function PreferenceSubContainer() {
	const preferences = useSelector((state) => state.preferences);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(preferencesActions.init({parent:location.state.parent,subType:location.state.subType}));
		} else {
			dispatch(preferencesActions.init());
		}
	}, []);

	const getState = () => {
		return preferences;
	}
	
	const getForm = () => {
		return "ADMIN_PREFERENCE_SUB_FORM";
	}	

	const onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSavePreference',msg:"test"});
		let errors = null;
		if (preferences != null && preferences.subType != null) {
			if (preferences.subType === "FORM") {
				errors = utils.validateFormFields(preferences.prefForms.ADMIN_FORMFIELD_FORM, preferences.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (preferences.subType === "LABEL") {
				errors = utils.validateFormFields(preferences.prefForms.ADMIN_LABEL_FORM, preferences.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (preferences.subType === "TEXT") {
				errors = utils.validateFormFields(preferences.prefForms.ADMIN_TEXT_FORM, preferences.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (preferences.subType === "OPTION") {
				errors = utils.validateFormFields(preferences.prefForms.ADMIN_OPTION_FORM, preferences.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			}
		} else {
			errors = utils.validateFormFields(preferences.prefForms.ADMIN_PREFERENCE_FORM, preferences.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
		}
		
		if (errors.isValid){
			dispatch(preferencesActions.saveItem({state:preferences,parent:preferences.parent}));
		} else {
			dispatch(preferencesActions.setErrors({errors:errors.errorMap}));
		}
	}
	
	
	const onMoveSelect = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSelect',msg:"test"});
		if (item != null) {
			dispatch(preferencesActions.moveSelect({state:preferences,item}));
		}
	}
	
	const onMoveSave = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSave',msg:"test"});
		if (item != null) {
			dispatch(preferencesActions.moveSave({state:preferences,code,item}));
		}
	}
	
	const onMoveCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveCancel',msg:"test"});
		dispatch(preferencesActions.moveCancel({state:preferences}));
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
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
	if (preferences.isModifyOpen) {
		fuLogger.log({level:'TRACE',loc:'PreferenceSubContainer::render',msg:"view PreferenceSubModifyView"});
		return (
			<PreferenceSubModifyView
			itemState={preferences}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}
			/>
		);
	} else if (preferences.items != null) {
		fuLogger.log({level:'TRACE',loc:'PreferenceSubContainer::render',msg:"view PreferenceSubView"});
		return (
			<PreferenceSubView
			itemState={preferences}
			appPrefs={appPrefs}
			onListLimitChange={BaseContainer.onListLimitChange}
			onSearchChange={BaseContainer.onSearchChange}
			onSearchClick={BaseContainer.onSearchClick}
			onPaginationClick={BaseContainer.onPaginationClick}
			onOrderBy={BaseContainer.onOrderBy}
			onOption={onOption}
			closeModal={BaseContainer.closeModal}
			inputChange={BaseContainer.inputChange}
			openFormView={openFormView}
			openLabelView={openLabelView}
			openTextView={openTextView}
			openOptionView={openOptionView}
			session={session}
			goBack={BaseContainer.goBack}/>
		);
	} else {
		return (<div> Loading </div>);
	}
}

export default PreferenceSubContainer;
