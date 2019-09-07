/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as serviceActions from './service-actions';
import fuLogger from '../../core/common/fu-logger';
import ServiceView from '../../adminView/service/service-view';


class ServiceContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_SERVICE",orderCriteria:[{'orderColumn':'ADMIN_SERVICE_TABLE_TITLE','orderDir':'ASC'},{'orderColumn':'ADMIN_SERVICE_TABLE_CODE','orderDir':'ASC'}],
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSaveService = this.onSaveService.bind(this);
		this.onDeleteService = this.onDeleteService.bind(this);
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
			let searchCriteria = {'searchValue':this.state['ADMIN_SERVICE_SEARCH_input'],'searchColumn':'ADMIN_SERVICE_TABLE_TITLE'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'ServiceContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_SERVICE_ListLimit');
			let listStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_SERVICE_PAGINATION"] != null && this.state["ADMIN_SERVICE_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_SERVICE_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_SERVICE_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_SERVICE_SEARCH_input'],'searchColumn':'ADMIN_SERVICE_TABLE_TITLE'};
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
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_SERVICE_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_SERVICE_TABLE_TITLE'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ServiceContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSaveService() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ServiceContainer::onSaveService',msg:"test"});

			if (this.props.services.selected != null && this.props.services.selected.name != "" && this.props.services.selected.code != "" ){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['SERVICE_SEARCH_input'],'searchColumn':'SERVICE_TABLE_TITLE'};
				this.props.actions.saveService(this.props.services.selected,this.props.services.listStart,this.props.services.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.services.selected == null || this.props.services.selected.name == null || this.props.services.selected.name == "" ){
					errors.SERVICE_NAME_input = "Missing!";
				}
				if (this.props.services.selected == null || this.props.services.selected.code == null || this.props.services.selected.code == "") {
					errors.SERVICE_CODE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onDeleteService(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ServiceContainer::onDeleteService',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['SERVICE_SEARCH_input'],'searchColumn':'SERVICE_TABLE_TITLE'};
			this.props.actions.deleteService(id,this.props.services.listStart,this.props.services.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openEditModal(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'ServiceContainer::openEditModal',msg:"id " + id});
			this.setState({isEditModalOpen:true});
			this.props.actions.servicePage();
			if (id != null) {
				this.props.actions.service(id);
			} else {
				this.props.actions.clearService();
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
		fuLogger.log({level:'TRACE',loc:'ServiceContainer::render',msg:"Hi there"});
		if (this.props.services.items != null) {
			return (
				<ServiceView 
				containerState={this.state}
				services={this.props.services}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openEditModal={this.openEditModal}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onSaveService={this.onSaveService}
				onDeleteService={this.onDeleteService}
				inputChange={this.inputChange}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
  }
}

ServiceContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	services: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, services:state.services};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(serviceActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(ServiceContainer);
