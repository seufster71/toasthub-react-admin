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
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as preferencesActions from './preferences-sub-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferenceSubView from '../../adminView/preferences/preferences-sub-view';
import PreferenceSubModifyView from '../../adminView/preferences/preferences-sub-modify-view';
import utils from '../../core/common/utils';
import BaseContainer from '../../core/container/base-container';

/*
* Preference Sub Page
*/
class PreferenceSubContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init({parent:this.props.history.location.state.parent,subType:this.props.history.location.state.subType});
		} else {
			this.props.actions.init();
		}
	}

	getState = () => {
		return this.props.preferences;
	}
	
	getForm = () => {
		return "ADMIN_PREFERENCE_SUB_FORM";
	}	

	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSavePreference',msg:"test"});
		let errors = null;
		if (this.props.preferences != null && this.props.preferences.subType != null) {
			if (this.props.preferences.subType === "FORM") {
				errors = utils.validateFormFields(this.props.preferences.prefForms.ADMIN_FORMFIELD_FORM, this.props.preferences.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (this.props.preferences.subType === "LABEL") {
				errors = utils.validateFormFields(this.props.preferences.prefForms.ADMIN_LABEL_FORM, this.props.preferences.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (this.props.preferences.subType === "TEXT") {
				errors = utils.validateFormFields(this.props.preferences.prefForms.ADMIN_TEXT_FORM, this.props.preferences.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (this.props.preferences.subType === "OPTION") {
				errors = utils.validateFormFields(this.props.preferences.prefForms.ADMIN_OPTION_FORM, this.props.preferences.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			}
		} else {
			errors = utils.validateFormFields(this.props.preferences.prefForms.ADMIN_PREFERENCE_FORM, this.props.preferences.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
		}
		
		if (errors.isValid){
			this.props.actions.saveItem({state:this.props.preferences,parent:this.props.preferences.parent});
		} else {
			this.props.actions.setErrors({errors:errors.errorMap});
		}
	}
	
	
	onMoveSelect = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSelect',msg:"test"});
		if (item != null) {
			this.props.actions.moveSelect({state:this.props.preferences,item});
		}
	}
	
	onMoveSave = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSave',msg:"test"});
		if (item != null) {
			this.props.actions.moveSave({state:this.props.preferences,code,item});
		}
	}
	
	onMoveCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveCancel',msg:"test"});
		this.props.actions.moveCancel({state:this.props.preferences});
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'MOVESELECT': {
				this.onMoveSelect(item);
				break;
			}
			case 'MOVEABOVE': {
				this.onMoveSave(code,item);
				break;
			}
			case 'MOVEBELOW': {
				this.onMoveSave(code,item);
				break;
			}
			case 'MOVECANCEL': {
				this.onMoveCancel();
				break;
			}
		}
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"test "});
		if (this.props.preferences.isModifyOpen) {
			fuLogger.log({level:'TRACE',loc:'PreferenceSubContainer::render',msg:"view PreferenceSubModifyView"});
			return (
				<PreferenceSubModifyView
				itemState={this.props.preferences}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				/>
			);
		} else if (this.props.preferences.items != null) {
			fuLogger.log({level:'TRACE',loc:'PreferenceSubContainer::render',msg:"view PreferenceSubView"});
			return (
				<PreferenceSubView
				itemState={this.props.preferences}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				onOption={this.onOption}
				closeModal={this.closeModal}
				inputChange={this.inputChange}
				openFormView={this.openFormView}
				openLabelView={this.openLabelView}
				openTextView={this.openTextView}
				openOptionView={this.openOptionView}
				session={this.props.session}
				goBack={this.goBack}/>
			);
		} else {
			return (<div> Loading </div>);
		}
  }
}

PreferenceSubContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	codeType: PropTypes.string,
	preferences: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, preferences:state.preferenceSub, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(preferencesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PreferenceSubContainer);
