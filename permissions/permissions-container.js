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
import * as permissionsActions from './permissions-actions';
import fuLogger from '../../core/common/fu-logger';
import utils from '../../core/common/utils';
import PermissionsView from '../../adminView/permissions/permissions-view';
import PermissionsModifyView from '../../adminView/permissions/permissions-modify-view';
import RolePermissionsModifyView from '../../adminView/permissions/role-permissions-modify-view';

/*
* Permission Page
*/
class PermissionsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_PERMISSION", isDeleteModalOpen: false, errors:null, warns:null, successes:null};
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
		this.props.actions.listLimit({state:this.props.permissions,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.permissions.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["ADMIN_PERMISSION_PAGINATION"] != null && this.state["ADMIN_PERMISSION_PAGINATION"] != ""){
			oldValue = this.state["ADMIN_PERMISSION_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.permissions.listLimit);
		this.setState({"ADMIN_PERMISSION_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.permissions,listStart});
	}

	onSearchChange = (fieldName, event) => {
		if (event.type === 'keypress') { 
			if (event.key === 'Enter') {
				this.searchClick(fieldName,event);
			}
		} else if (event.type === 'change') {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		}
	}

	onSearchClick = (fieldName, event) => {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_PERMISSION-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_PERMISSION-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.permissions.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_PERMISSION-SEARCH'];
				option.searchColumn = this.props.permissions.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.permissions,searchCriteria});
	}

	onOrderBy = (selectedOption) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onOrderBy',msg:"id " + selectedOption});
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
			let option = {orderColumn:"ADMIN_PERMISSION_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.permissions,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.permissions.prefForms.ADMIN_PERMISSION_PAGE,this.props.permissions.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.savePermission({state:this.props.permissions});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null){
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onModify',msg:"item id "+id});
		this.props.actions.permission(id);
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onDelete',msg:"test"+item.id});
		this.setState({isDeleteModalOpen:false});
		this.props.actions.deletePermission({state:this.props.permissions,id:item.id});
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		this.props.actions.list({state:this.props.permissions});
	}
	
	inputChange = (fieldName,switchValue) => {
		utils.inputChange(this.props,fieldName,switchValue);
	}
	
	onRolePermissionModify = (item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionModify',msg:"test"+item.id});
		if (item.rolePermission != null) {
			this.props.actions.rolePermission({rolePermissionId:item.rolePermission.id,permissionId:item.id});
		} else {
			this.props.actions.rolePermission({permissionId:item.id});
		}
	}
	
	onRolePermissionSave = () => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionSave',msg:"test"});
		let errors = utils.validateFormFields(this.props.permissions.prefForms.ADMIN_ROLE_PERMISSION_FORM,this.props.permissions.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.saveRolePermission({state:this.props.permissions});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	goBack = () => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::goBack',msg:"test"});
		this.props.history.goBack();
	}
	
	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'PermissionContainer::onOption',msg:" code "+code});
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
			case 'MODIFY_ROLE_PERMISSION': {
				this.onRolePermissionModify(item);
				break;
			}
		}
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'PermissionsContainer::render',msg:"Hi there"});
		if (this.props.permissions.isModifyOpen) {
			return (
				<PermissionsModifyView
				containerState={this.state}
				item={this.props.permissions.selected}
				inputFields={this.props.permissions.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.permissions.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				applicationSelectList={this.props.permissions.applicationSelectList}/>
			);
		} else if (this.props.permissions.isRolePermissionOpen) {
			return (
				<RolePermissionsModifyView
				containerState={this.state}
				item={this.props.permissions.selected}
				inputFields={this.props.permissions.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.permissions.prefForms}
				onSave={this.onRolePermissionSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.permissions.items != null) {
			return (
				<PermissionsView 
				containerState={this.state}
				permissions={this.props.permissions}
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

PermissionsContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	permissions: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, permissions:state.permissions, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(permissionsActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PermissionsContainer);
