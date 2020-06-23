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
import {withRouter} from "react-router";
import * as preferencesActions from './preferences-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferencesView from '../../adminView/preferences/preferences-view';
import PreferenceSubView from '../../adminView/preferences/preference-subview';
import PreferenceModifyView from '../../adminView/preferences/preference-modify-view';
import utils from '../../core/common/utils';

/*
* Preferences Page
*/
class PreferencesContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_PREFERENCE",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
	}

	componentDidMount() {
		let orderCriteria = [{'orderColumn':'ADMIN_PREFERENCE_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_PREFERENCE_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_PREFERENCE_TABLE_TITLE'}];
		this.props.actions.init({state:this.props.preferences,orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}

	onListLimitChange = (fieldName, event) => {
		let value = 20;
		if (this.props.codeType === 'NATIVE') {
			value = event.nativeEvent.text;
		} else {
			value = event.target.value;
		}

		let pageLimit = parseInt(value);
		if (this.props.preferenceSubView.viewType != null) {
			this.props.actions.listLimit({state:this.props.preferences,stateSubView:this.props.preferenceSubView,listLimit});
		} else {
			this.props.actions.listLimit({state:this.props.preferences,listLimit});
		}
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.preferences.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["ADMIN_PREFERENCE_PAGINATION"] != null && this.state["ADMIN_PREFERENCE_PAGINATION"] != ""){
			oldValue = this.state["ADMIN_PREFERENCE_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.preferences.listLimit);
		this.setState({"ADMIN_PREFERENCE_PAGINATION":segmentValue});
		if (this.props.preferenceSubView.viewType != null) {
			this.props.actions.list({state:this.props.preferences,stateSubView:this.props.preferenceSubView,listStart});
		} else {
			this.props.actions.list({state:this.props.preferences,listStart});
		}
	}

	onSearchChange = (fieldName, event) => {
		return (event) => {
			if (event.type === 'keypress') {
				if (event.key === 'Enter') {
					this.onSearchClick(fieldName,event);
				}
			} else {
				if (this.props.codeType === 'NATIVE') {
					this.setState({[fieldName]:event.nativeEvent.text});
				} else {
					this.setState({[fieldName]:event.target.value});
				}
			}
		};
	}

	onSearchClick = (fieldName, event) => {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_PREFERENCE-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_PREFERENCE-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			if (this.props.preferenceSubView.viewType != null) {
				for (let i = 0; i < this.props.preferenceSubView.searchCriteria.length; i++) {
					let option = {};
					option.searchValue = this.state['ADMIN_PREFERENCE-SEARCH'];
					option.searchColumn = this.props.preferenceSubView.searchCriteria[i].searchColumn;
					searchCriteria.push(option);
				}
			} else {
				for (let i = 0; i < this.props.preferences.searchCriteria.length; i++) {
					let option = {};
					option.searchValue = this.state['ADMIN_PREFERENCE-SEARCH'];
					option.searchColumn = this.props.preferences.searchCriteria[i].searchColumn;
					searchCriteria.push(option);
				}
			}
		}
		if (this.props.preferenceSubView.viewType != null) {
			this.props.actions.search({state:this.props.preferences,stateSubView:this.props.preferenceSubView,searchCriteria});
		} else {
			this.props.actions.search({state:this.props.preferences,searchCriteria});
		}
	}
	
	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'PreferenceContainer::onOrderBy',msg:"id " + selectedOption});
		let orderCriteria = [];
		if (event != null) {
			for (let o = 0; o < event.length; o++) {
				let option = {};
				if (event[o].label.includes("ASC")) {
					option.orderColumn = event[o].value;
					option.orderDir = "ASC";
				} else if (event[o].label.includes("DESC")){
					option.orderColumn = event[o].value;
					option.orderDir = "DESC";
				} else {
					option.orderColumn = event[o].value;
				}
				orderCriteria.push(option);
			}
		} else {
			let option = {orderColumn:"ADMIN_PREFERENCE_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		if (this.props.preferenceSubView.viewType != null) {
			this.props.actions.orderBy({state:this.props.preferences,stateSubView:this.props.preferenceSubView,orderCriteria});
		} else {
			this.props.actions.orderBy({state:this.props.preferences,orderCriteria});
		}
	}

	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSavePreference',msg:"test"});
		let viewType = null;
		let errors = null;
		if (this.props.preferenceSubView != null && this.props.preferenceSubView.viewType != null) {
			viewType = this.props.preferenceSubView.viewType;
			if (viewType === "FORM") {
				errors = utils.validateFormFields(this.props.preferenceSubView.prefForms.ADMIN_FORMFIELD_FORM, this.props.preferenceSubView.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (viewType === "LABEL") {
				errors = utils.validateFormFields(this.props.preferenceSubView.prefForms.ADMIN_LABEL_FORM, this.props.preferenceSubView.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (viewType === "TEXT") {
				errors = utils.validateFormFields(this.props.preferenceSubView.prefForms.ADMIN_TEXT_FORM, this.props.preferenceSubView.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			} else if (viewType === "OPTION") {
				errors = utils.validateFormFields(this.props.preferenceSubView.prefForms.ADMIN_OPTION_FORM, this.props.preferenceSubView.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
			}
		} else {
			errors = utils.validateFormFields(this.props.preferences.prefForms.ADMIN_PREFERENCE_FORM, this.props.preferences.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES, "FORM1");
		}
		
		if (errors.isValid){
			if (viewType != null) {
				this.props.actions.savePreference({state:this.props.preferences,stateSubView:this.props.preferenceSubView,parent:this.props.preferenceSubView.parent});
			} else {
				this.props.actions.savePreference({state:this.props.preferences,viewType});
			}
		} else {
			this.setState({errors:errors.errorMap});
		}
	}

	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onModify',msg:"item id "+id});
		let viewType = null;
		if (this.props.preferences.isSubViewOpen && this.props.preferenceSubView != null) {
			viewType = this.props.preferenceSubView.viewType;
		}
		this.props.actions.modifyItem({id,viewType,languages:this.props.appPrefs.prefGlobal.LANGUAGES,appPrefs:this.props.appPrefs});
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onDelete',msg:"item id " + item.id});
		let viewType = null;
		if (this.props.preferences.isSubViewOpen && this.props.preferenceSubView != null) {
			viewType = this.props.preferenceSubView.viewType;
		}
		this.setState({isDeleteModalOpen:false});
		this.props.actions.deletePreference({state:this.props.preferences,stateSubView:this.props.preferenceSubView,id:item.id,viewType});
	}

	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}

	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}

	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PreferenceContainer::onCancel',msg:"test"});
		if (this.props.preferenceSubView.viewType != null) {
			this.props.actions.list({state:this.props.preferences,stateSubView:this.props.preferenceSubView});
		} else {
			this.props.actions.list({state:this.props.preferences});
		}
	}
	
	inputChange = (fieldName,switchValue,event) => {
		let value = "";
		if (switchValue === "DATE") {
			value = event.toISOString();
		} else {
			value = switchValue;
		}
		let viewType = null;
		if (this.props.preferenceSubView != null && this.props.preferenceSubView.viewType != null){
			viewType = this.props.preferenceSubView.viewType;
		}
		utils.inputChange(this.props,fieldName,switchValue,viewType);
	}
	
	openFormView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openFormView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_FORMFIELD_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_FORMFIELD_TABLE_TITLE'}];
		this.props.actions.init({state:this.props.preferences,stateSubView:this.props.preferenceSubView,item,viewType:"FORM",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	openLabelView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openLabelView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_LABEL_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_LABEL_TABLE_TITLE'}];
		this.props.actions.init({state:this.props.preferences,stateSubView:this.props.preferenceSubView,item,viewType:"LABEL",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	openTextView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openTextView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_TEXT_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_TEXT_TABLE_TITLE'}];
		this.props.actions.init({state:this.props.preferences,stateSubView:this.props.preferenceSubView,item,viewType:"TEXT",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	openOptionView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openOptionView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_OPTION_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_OPTION_TABLE_TITLE'}];
		this.props.actions.init({state:this.props.preferences,stateSubView:this.props.preferenceSubView,item,viewType:"OPTION",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	goBack = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::goBack',msg:"test"});
		this.props.actions.goBack();
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onOption',msg:" code "+code});
		switch(code) {
			case 'MODIFY': {
				this.onModify(item);
				break;
			}
			case 'DELETE': {
				this.openDeleteModal(item);
				break;
			}
			case 'DELETEFINAL': {
				this.onDelete(item);
				break;
			}
			case 'SHOW_FORMFIELDS': {
				this.openFormView(item);
				break;
			}
			case 'SHOW_LABELS': {
				this.openLabelView(item);
				break;
			}
			case 'SHOW_TEXTS': {
				this.openTextView(item);
				break;
			}
			case 'SHOW_OPTIONS': {
				this.openOptionView(item);
				break;
			}
		}
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"test " + JSON.stringify(this.state)});
		let inputFields = this.props.preferences.inputFields;
		let prefForms = this.props.preferences.prefForms;
		let selected = this.props.preferences.selected;
		let viewType = null;
		if (this.props.preferenceSubView.isModifyOpen) {
			inputFields = this.props.preferenceSubView.inputFields;
			prefForms = this.props.preferenceSubView.prefForms;
			selected = this.props.preferenceSubView.selected;
			viewType = this.props.preferenceSubView.viewType;
		}
		if (this.props.preferences.isModifyOpen || this.props.preferenceSubView.isModifyOpen) {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceModifyView"});
			return (
				<PreferenceModifyView
				containerState={this.state}
				item={selected}
				inputFields={inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				viewType={viewType}
				/>
			);
		} else if (this.props.preferences.isSubViewOpen) {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceSubView"});
			return (
				<PreferenceSubView
				containerState={this.state}
				preferenceState={this.props.preferenceSubView}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				onOption={this.onOption}
				closeModal={this.closeModal}
				inputChange={this.inputChange}
				goBack={this.goBack}
				session={this.props.session}/>
				);
		} else if (this.props.preferences.items != null) {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceView"});
			return (
				<PreferencesView
				containerState={this.state}
				preferenceState={this.props.preferences}
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
				session={this.props.session}/>
			);
		} else {
			return (<div> Loading </div>);
		}
  }
}

PreferencesContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	codeType: PropTypes.string,
	preferences: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, preferences:state.preferences, session:state.session, preferenceSubView:state.preferenceSubView};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(preferencesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PreferencesContainer);
