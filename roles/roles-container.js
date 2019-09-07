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
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSaveRole = this.onSaveRole.bind(this);
		this.onDeleteRole = this.onDeleteRole.bind(this);
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
	
	onSaveRole() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onSaveRole',msg:"test"});

			if (this.props.roles.selected != null && this.props.roles.selected.name != "" && this.props.roles.selected.code != "" ){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['ROLE_SEARCH_input'],'searchColumn':'ROLE_TABLE_TITLE'};
				this.props.actions.saveRole(this.props.roles.selected,this.props.roles.listStart,this.props.roles.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.roles.selected == null || this.props.roles.selected.name == null || this.props.roles.selected.name == "" ){
					errors.ROLE_NAME_input = "Missing!";
				}
				if (this.props.roles.selected == null || this.props.roles.selected.code == null || this.props.roles.selected.code == "") {
					errors.ROLE_CODE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onDeleteRole(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::onDeleteLanguage',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['ROLE_SEARCH_input'],'searchColumn':'ROLE_TABLE_TITLE'};
			this.props.actions.deleteRole(id,this.props.roles.listStart,this.props.roles.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openEditModal(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'RoleContainer::openEditModal',msg:"id " + id});
			this.setState({isEditModalOpen:true});
			this.props.actions.rolePage();
			if (id != null) {
				this.props.actions.role(id);
			} else {
				this.props.actions.clearRole();
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
		fuLogger.log({level:'TRACE',loc:'RolesContainer::render',msg:"Hi there"});
		if (this.props.roles.items != null) {
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
				openEditModal={this.openEditModal}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onSaveRole={this.onSaveRole}
				onDeleteRole={this.onDeleteRole}
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
