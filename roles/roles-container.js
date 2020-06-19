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
import * as rolesActions from './roles-actions';
import fuLogger from '../../core/common/fu-logger';
import RolesView from '../../adminView/roles/roles-view';
import RolesModifyView from '../../adminView/roles/roles-modify-view';
import UserRolesModifyView from '../../adminView/roles/user-roles-modify-view';
import utils from '../../core/common/utils';


class RolesContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_ROLE",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent);
		} else {
			this.props.actions.init();
		}
	}

	onListLimitChange = (fieldName, event) => {
		let value = 20;
		if (this.props.codeType === 'NATIVE') {
			value = event.nativeEvent.text;
		} else {
			value = event.target.value;
		}

		let listLimit = parseInt(value);
		this.props.actions.listLimit({state:this.props.roles,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.roles.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["ADMIN_ROLE_PAGINATION"] != null && this.state["ADMIN_ROLE_PAGINATION"] != ""){
			oldValue = this.state["ADMIN_ROLE_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.roles.listLimit);
		this.setState({"ADMIN_ROLE_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.roles,listStart});
	}

	onSearchChange = (fieldName, event) => {
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
	}

	onSearchClick = (fieldName, event) => {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_ROLE-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_ROLE-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.roles.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_ROLE-SEARCH'];
				option.searchColumn = this.props.roles.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.roles,searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onOrderBy',msg:"id " + selectedOption});
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
			let option = {orderColumn:"ADMIN_ROLE_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.roles,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.roles.prefForms.ADMIN_ROLE_FORM, this.props.roles.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.saveRole({state:this.props.roles});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onModify',msg:"item id "+id});
		this.props.actions.modifyItem({id,appPrefs:this.props.appPrefs});
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onDelete',msg:"test"+item.id});
		this.setState({isDeleteModalOpen:false});
		this.props.actions.deleteRole({state:this.props.roles,id:item.id});
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	onModifyPermissions = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onModifyPermissions',msg:"test"+item.id});
		this.props.history.push({pathname:'/admin-permissions',state:{parent:item}});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.roles});
	}
	
	inputChange = (fieldName,switchValue,event) => {
		let value = "";
		if (switchValue === "DATE") {
			value = event.toISOString();
		} else {
			value = switchValue;
		}
		utils.inputChange(this.props,fieldName,value);
	}

	onUserRoleModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleModify',msg:"test"+item.id});
		if (item.userRole != null) {
			this.props.actions.modifyUserRole({userRoleId:item.userRole.id,roleId:item.id,appPrefs:this.props.appPrefs});
		} else {
			this.props.actions.modifyUserRole({roleId:item.id,appPrefs:this.props.appPrefs});
		}
	}
	
	onUserRoleSave = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onUserRoleSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.roles.prefForms.ADMIN_USER_ROLE_FORM,this.props.roles.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_NAME'};
			this.props.actions.saveRolePermission({state:this.props.roles});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	goBack = () => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::goBack',msg:"test"});
		this.props.history.goBack();
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'RoleContainer::onOption',msg:" code "+code});
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
			case 'MODIFY_USER_ROLE': {
				this.onUserRoleModify(item);
				break;
			}
			case 'MODIFY_PERMISSION': {
				this.onModifyPermissions(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'RolesContainer::render',msg:"Hi there"});
		if (this.props.roles.isModifyOpen) {
			return (
				<RolesModifyView
				containerState={this.state}
				item={this.props.roles.selected}
				inputFields={this.props.roles.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.roles.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				applicationSelectList={this.props.roles.applicationSelectList}/>
			);
		} else if (this.props.roles.isUserRoleOpen) {
			return (
				<UserRolesModifyView
				containerState={this.state}
				item={this.props.roles.selected}
				inputFields={this.props.roles.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.roles.prefForms}
				onSave={this.onUserRoleSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.roles.items != null) {
			return (
				<RolesView 
				containerState={this.state}
				rolesState={this.props.roles}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				goBack={this.goBack}
				session={this.props.session}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
 	}
}

RolesContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	roles: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, roles:state.roles, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(rolesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(RolesContainer);
