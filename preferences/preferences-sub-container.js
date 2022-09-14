/*
 * Copyright (C) 2016 - 2050 The ToastHub Project
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
import * as actions from './preferences-sub-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferenceSubView from '../../adminView/preferences/preferences-sub-view';
import PreferenceSubModifyView from '../../adminView/preferences/preferences-sub-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';

/*
* Preference Sub Page
*/
function PreferenceSubContainer({location,navigate}) {
	const itemState = useSelector((state) => state.adminpreferenceSub);
	const session = useSelector((state) => state.session);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (location.state != null && location.state.parent != null) {
			dispatch(actions.init({parent:location.state.parent,subType:location.state.subType}));
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

	const onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSavePreference',msg:"test"});
		let errors = null;
		if (itemState != null && itemState.subType != null) {
			if (itemState.subType === "FORM") {
				errors = utils.validateFormFields(itemState.prefForms.ADMIN_FORMFIELD_FORM, itemState.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (itemState.subType === "LABEL") {
				errors = utils.validateFormFields(itemState.prefForms.ADMIN_LABEL_FORM, itemState.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (itemState.subType === "TEXT") {
				errors = utils.validateFormFields(itemState.prefForms.ADMIN_TEXT_FORM, itemState.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (itemState.subType === "OPTION") {
				errors = utils.validateFormFields(itemState.prefForms.ADMIN_OPTION_FORM, itemState.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
			}
		} else {
			errors = utils.validateFormFields(itemState.prefForms.ADMIN_PREFERENCE_FORM, itemState.inputFields, appPrefs.prefGlobal.LANGUAGES, "FORM1");
		}
		
		if (errors.isValid){
			dispatch(actions.saveItem({state:itemState,parent:itemState.parent}));
		} else {
			dispatch(actions.setStatus({errors:errors.errorMap}));
		}
	}
	
	
	const onMoveSelect = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSelect',msg:"test"});
		if (item != null) {
			dispatch(actions.moveSelect({state:itemState,item}));
		}
	}
	
	const onMoveSave = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSave',msg:"test"});
		if (item != null) {
			dispatch(actions.moveSave({state:itemState,code,item}));
		}
	}
	
	const onMoveCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveCancel',msg:"test"});
		dispatch(actions.moveCancel({state:itemState}));
	}
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase({state:itemState,actions:actions,dispatch:dispatch,code:code,appPrefs:appPrefs,item:item})) {
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
	if (itemState.view == "MODIFY") {
		fuLogger.log({level:'TRACE',loc:'PreferenceSubContainer::render',msg:"view PreferenceSubModifyView"});
		return (
			<PreferenceSubModifyView
			itemState={itemState}
			appPrefs={appPrefs}
			onSave={onSave}
			onCancel={onCancel}
			inputChange={inputChange}
			/>
		);
	} else if (itemState.view == "MAIN" && itemState.items != null) {
		fuLogger.log({level:'TRACE',loc:'PreferenceSubContainer::render',msg:"view PreferenceSubView"});
		return (
			<PreferenceSubView
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
			session={session}
			goBack={goBack}/>
		);
	} else {
		return (<div> Loading </div>);
	}
}

export default PreferenceSubContainer;
