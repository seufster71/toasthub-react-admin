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

/*
* Permission Page
*/
class PermissionsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_PERMISSION",orderCriteria:[{'orderColumn':'ADMIN_PERMISSION_TABLE_NAME','orderDir':'ASC'},{'orderColumn':'ADMIN_PERMISSION_TABLE_CODE','orderDir':'ASC'}],
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSavePermission = this.onSavePermission.bind(this);
		this.onDeletePermission = this.onDeletePermission.bind(this);
		this.inputChange = this.inputChange.bind(this);
	}

	componentDidMount() {
		this.props.actions.init();
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
			let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
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

			let searchCriteria = {'searchValue':this.state['ADMIN_PERMISSION_SEARCH_input'],'searchColumn':'ADMIN_PERMISSION_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
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
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSavePermission() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onSavePermission',msg:"test"});

			if (this.props.permissions.selected != null && this.props.permissions.selected.name != "" && this.props.permissions.selected.code != "" ){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['PERMISSION_SEARCH_input'],'searchColumn':'PERMISSION_TABLE_NAME'};
				this.props.actions.savePermission(this.props.permissions.selected,this.props.permissions.listStart,this.props.permissions.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.permissions.selected == null || this.props.permissions.selected.name == null || this.props.permissions.selected.name == "" ){
					errors.PERMISSION_NAME_input = "Missing!";
				}
				if (this.props.permissions.selected == null || this.props.permissions.selected.code == null || this.props.permissions.selected.code == "") {
					errors.PERMISSION_CODE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onDeletePermission(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::onDeletePermission',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['PERMISSION_SEARCH_input'],'searchColumn':'PERMISSION_TABLE_NAME'};
			this.props.actions.deletePermission(id,this.props.permissions.listStart,this.props.permissions.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openEditModal(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PermissionContainer::openEditModal',msg:"id " + id});
			this.setState({isEditModalOpen:true});
			this.props.actions.permissionPage();
			if (id != null) {
				this.props.actions.permission(id);
			} else {
				this.props.actions.clearPermission();
			}
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedId:id,selectedName:name});
		}
	}
	
	closeModal() {
		return (event) => {
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false,errors:{}});
		};
	}
	
	inputChange(fieldName) {
		return (event) => {
			let	value = event.target.value;
			this.props.actions.inputChange(fieldName,value);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'PermissionsContainer::render',msg:"Hi there"});
		if (this.props.permissions.items != null) {
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
				openEditModal={this.openEditModal}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onSavePermission={this.onSavePermission}
				onDeletePermission={this.onDeletePermission}
				inputChange={this.inputChange}
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
