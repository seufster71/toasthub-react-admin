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
import * as preferencesActions from './preferences-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferencesView from '../../adminView/preferences/preferences-view';
import PreferenceModifyView from '../../adminView/preferences/preferences-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Preferences Page
*/
class PreferencesContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.actions.init();
	}

	getState = () => {
		return this.props.preferences;
	}
	
	getForm = () => {
		return "ADMIN_PREFERENCE_FORM";
	}	
	
	openFormView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openFormView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_FORMFIELD_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_FORMFIELD_TABLE_TITLE'}];
		this.props.actions.initSubView({itemState:this.props.preferenceSubView,item,viewType:"FORM",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	openLabelView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openLabelView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_LABEL_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_LABEL_TABLE_TITLE'}];
		this.props.actions.initSubView({itemState:this.props.preferenceSubView,item,viewType:"LABEL",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	openTextView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openTextView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_TEXT_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_TEXT_TABLE_TITLE'}];
		this.props.actions.initSubView({itemState:this.props.preferenceSubView,item,viewType:"TEXT",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	openOptionView = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::openOptionView',msg:"id "+item.id});
		let orderCriteria = [{'orderColumn':'ADMIN_OPTION_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_OPTION_TABLE_TITLE'}];
		this.props.actions.initSubView({itemState:this.props.preferenceSubView,item,viewType:"OPTION",orderCriteria,searchCriteria,listStart:0,listLimit:20});
	}
	
	onMoveSelect = (item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSelect',msg:"test"});
		if (item != null) {
			this.props.actions.moveSelect({state:this.props.preferences,stateSubView:this.props.preferenceSubView,item});
		}
	}
	
	onMoveSave = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveSave',msg:"test"});
		if (item != null) {
			this.props.actions.moveSave({state:this.props.preferences,code,item,stateSubView:this.props.preferenceSubView});
		}
	}
	
	onMoveCancel = () => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onMoveCancel',msg:"test"});
		this.props.actions.moveCancel({state:this.props.preferences,stateSubView:this.props.preferenceSubView});
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
		
		switch(code) {
			case 'SHOW_FORMFIELDS': {
				this.props.history.push({pathname:'/admin-prefsub',state:{parent:item,subType:"FORM"}});
				break;
			}
			case 'SHOW_LABELS': {
				this.props.history.push({pathname:'/admin-prefsub',state:{parent:item,subType:"LABEL"}});
				break;
			}
			case 'SHOW_TEXTS': {
				this.props.history.push({pathname:'/admin-prefsub',state:{parent:item,subType:"TEXT"}});
				break;
			}
			case 'SHOW_OPTIONS': {
				this.props.history.push({pathname:'/admin-prefsub',state:{parent:item,subType:"OPTION"}});
				break;
			}
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
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceModifyView"});
			return (
				<PreferenceModifyView
				itemState={this.props.preferences}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				/>
			);
		} else if (this.props.preferences.items != null) {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"view PreferenceView"});
			return (
				<PreferencesView
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
  return {appPrefs:state.appPrefs, preferences:state.preferences, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(preferencesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PreferencesContainer);
