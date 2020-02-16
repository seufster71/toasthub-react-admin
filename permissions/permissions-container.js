/*
* Author Edward Seufert
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
		this.state = {pageName:"ADMIN_PERMISSION",orderCriteria:[{'orderColumn':'ADMIN_PERMISSION_TABLE_NAME','orderDir':'ASC'},{'orderColumn':'ADMIN_PERMISSION_TABLE_CODE','orderDir':'ASC'}],
				isDeleteModalOpen: false, errors:null, warns:null, successes:null};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onModify = this.onModify.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onRolePermissionModify = this.onRolePermissionModify.bind(this);
		this.onRolePermissionSave = this.onRolePermissionSave.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	componentDidMount() {
		if (this.props.history.location.state != null && this.props.history.location.state.parent != null) {
			this.props.actions.init(this.props.history.location.state.parent);
		} else {
			this.props.actions.init();
		}
	}

	onListLimitChange(fieldName) {
		return (event) => {
			let value = 20;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
				this.setState({[fieldName]:parseInt(event.nativeEvent.text)});
			} else {
				value = event.target.value;
				this.setState({[fieldName]:parseInt(event.target.value)});
			}

			let listStart = 0;
			let listLimit = parseInt(value);
			let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'};
			this.props.actions.list({listStart,listLimit,searchCriteria,orderCriteria:this.state.orderCriteria,role:this.props.permissions.parent});
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_PERMISSION_ListLimit');
			let listStart = 0;
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
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_PERMISSION_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'};
			this.props.actions.list({listStart,listLimit,searchCriteria,orderCriteria:this.state.orderCriteria,role:this.props.permissions.parent});
		};
	}

	onSearchChange(fieldName) {
		return (event) => {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		};
	}

	onSearchClick(e) {
		return (event) => {
			let fieldName = "";
			if (this.props.codeType === 'NATIVE') {
				fieldName = e;
			} else {
				event.preventDefault();
				fieldName = event.target.id;
			}
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_PERMISSION_ListLimit');
			let searchCriteria = [{'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'},
				{'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_CODE'}];
			this.props.actions.list({listStart,listLimit,searchCriteria,orderCriteria:this.state.orderCriteria,role:this.props.permissions.parent});
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onSave',msg:"test"});
			let errors = utils.validateFormFields(this.props.permissions.appForms.ADMIN_PERMISSION_FORM,this.props.permissions.inputFields, this.props.appPrefs.appGlobal.LANGUAGES);
			
			if (errors.isValid){
				let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'};
				this.props.actions.savePermission(this.props.permissions.inputFields,this.props.permissions.listStart,this.props.permissions.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				this.setState({errors:errors.errorMap});
			}
		};
	}
	
	onModify(item) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onModify',msg:"test"+item.id});
			this.props.actions.permission(item.id);
		};
	}
	
	onDelete(item) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onDeletePermission',msg:"test"+item.id});
			this.setState({isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'};
			this.props.actions.deletePermission(item.id,this.props.permissions.listStart,this.props.permissions.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openDeleteModal(item) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedId:item.id,selectedName:item.title.defaultText});
		}
	}
	
	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}
	
	onCancel() {
		return (event) => {
			//fuLogger.log({level:'TRACE',loc:'UsersContainer::onCancel',msg:"test"});
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_PERMISSION_ListLimit');
			let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'};
			this.props.actions.list({listStart,listLimit,searchCriteria,orderCriteria:this.state.orderCriteria,role:this.props.permissions.parent});
		};
	}
	
	inputChange(fieldName,switchValue) {
		return (event) => {
			//fuLogger.log({level:'TRACE',loc:'PermissionContainer::inputChange',msg:"test "+fieldName});
			let	value = null;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
			} else {
				if (event != null) {
					if (event.target != null) {
						value = event.target.value;
					} else {
						value = event;
					}
				}
			}
			if (switchValue != null) {
				value = switchValue;
			}
			this.props.actions.inputChange(fieldName,value);
		};
	}
	
	onRolePermissionModify(item) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionModify',msg:"test"+item.id});
			if (item.rolePermission != null) {
				this.props.actions.rolePermission({rolePermissionId:item.rolePermission.id,permissionId:item.id});
			} else {
				this.props.actions.rolePermission({permissionId:item.id});
			}
		};
	}
	
	onRolePermissionSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onRolePermissionSave',msg:"test"});
			let errors = utils.validateFormFields(this.props.permissions.appForms.ADMIN_ROLE_PERMISSION_FORM,this.props.permissions.inputFields, this.props.appPrefs.appGlobal.LANGUAGES);
			
			if (errors.isValid){
				let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_NAME'};
				this.props.actions.saveRolePermission({inputFields:this.props.permissions.inputFields,listStart:this.props.permissions.listStart,
					listLimit:this.props.permissions.listLimit,searchCriteria,orderCriteria:this.state.orderCriteria,
					role:this.props.permissions.parent,permissionId:this.props.permissions.selected.permissionId});
			} else {
				this.setState({errors:errors.errorMap});
			}
		};
	}
	
	goBack() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::goBack',msg:"test"});
			this.props.history.goBack();
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
				itemAppForms={this.props.permissions.appForms}
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
				itemAppForms={this.props.permissions.appForms}
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
				onColumnSort={this.onColumnSort}
				openDeleteModal={this.openDeleteModal}
				closeModal={this.closeModal}
				onModify={this.onModify}
				onDelete={this.onDelete}
				onRolePermissionModify={this.onRolePermissionModify}
				inputChange={this.inputChange}
				goBack={this.goBack}
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
  return {appPrefs:state.appPrefs, permissions:state.permissions};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(permissionsActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PermissionsContainer);
