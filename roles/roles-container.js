/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as rolesActions from './roles-actions';
import fuLogger from '../../core/common/fu-logger';
import RolesView from '../../adminView/roles/roles-view';


class RolesContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_ROLE",orderCriteria:[{'orderColumn':'ADMIN_ROLE_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_ROLE_TABLE_CODE','orderDir':'ASC'}],
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
		this.onEditPermissions = this.onEditPermissions.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.onCancel = this.onCancel.bind(this);
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
			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_TITLE'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_ROLE_ListLimit');
			let listStart = 0;
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
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_ROLE_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_TITLE'};
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
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_ROLE_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_ROLE_TABLE_TITLE'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onSave',msg:"test"});
			let errors = utils.validateFormFields(this.props.roless.appForms.ADMIN_ROLE_FORM,this.props.roles.inputFields);
			
			if (errors.isValid){
				let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_TITLE'};
				this.props.actions.saveRole(this.props.roles.selected,this.props.roles.listStart,this.props.roles.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				this.setState({errors:errors.errorMap});
			}
		};
	}
	
	onModify(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onModify',msg:"test"+id});
			this.props.actions.role(id);
		};
	}
	
	onDelete(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onDelete',msg:"test"+id});
			this.setState({isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_TITLE'};
			this.props.actions.deleteRole(id,this.props.roles.listStart,this.props.roles.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedId:id,selectedName:name});
		}
	}
	
	onEditPermissions(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onEditPermissions',msg:"test"+id});
			this.props.actions.permissions(id);
		};
	}
	
	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}
	
	onCancel() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onCancel',msg:"test"});
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_ROLE_ListLimit');
			let searchCriteria = {'searchValue':this.state['ADMIN_ROLE_SEARCH_input'],'searchColumn':'ADMIN_ROLE_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	inputChange(fieldName,switchValue) {
		return (event) => {
			let	value = null;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
			} else {
				value = event.target.value;
			}
			if (switchValue != null) {
				value = switchValue;
			}
			this.props.actions.inputChange(fieldName,value);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'RolesContainer::render',msg:"Hi there"});
		if (this.props.roles.isModifyOpen) {
			return (
				<RolesModifyView
				containerState={this.state}
				role={this.props.roles.selected}
				inputFields={this.props.roles.inputFields}
				appPrefs={this.props.appPrefs}
				itemAppForms={this.props.roles.appForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.roles.items != null) {
			return (
				<RolesView 
				containerState={this.state}
				roles={this.props.roles}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onModify={this.onModify}
				onDelete={this.onDelete}
				onEditPermissions={this.onEditPermissions}
				inputChange={this.inputChange}
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
  return {appPrefs:state.appPrefs, roles:state.roles};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(rolesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(RolesContainer);
