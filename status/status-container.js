/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as statusActions from './status-actions';
import fuLogger from '../../core/common/fu-logger';
import StatusView from '../../adminView/status/status-view';


class StatusContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_STATUS",orderCriteria:[{'orderColumn':'ADMIN_STATUS_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_STATUS_TABLE_CODE','orderDir':'ASC'}],
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSaveStatus = this.onSaveStatus.bind(this);
		this.onDeleteStatus = this.onDeleteStatus.bind(this);
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
			let searchCriteria = {'searchValue':this.state['ADMIN_STATUS_SEARCH_input'],'searchColumn':'ADMIN_STATUS_TABLE_NAME'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'StatusContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_STATUS_ListLimit');
			let listStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_STATUS_PAGINATION"] != null && this.state["ADMIN_STATUS_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_STATUS_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_STATUS_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_STATUS_SEARCH_input'],'searchColumn':'ADMIN_STATUS_TABLE_NAME'};
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
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_STATUS_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_STATUS_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'StatusContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSaveStatus() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'StatusContainer::onSaveStatus',msg:"test"});

			if (this.props.statuses.selected != null && this.props.statuses.selected.name != "" && this.props.statuses.selected.code != "" ){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['STATUS_SEARCH_input'],'searchColumn':'STATUS_TABLE_NAME'};
				this.props.actions.saveStatus(this.props.statuses.selected,this.props.statuses.listStart,this.props.statuses.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.statuses.selected == null || this.props.statuses.selected.name == null || this.props.statuses.selected.name == "" ){
					errors.LANGUAGE_NAME_input = "Missing!";
				}
				if (this.props.statuses.selected == null || this.props.statuses.selected.code == null || this.props.statuses.selected.code == "") {
					errors.LANGUAGE_CODE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onDeleteStatus(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'StatusContainer::onDeleteStatus',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['STATUS_SEARCH_input'],'searchColumn':'STATUS_TABLE_NAME'};
			this.props.actions.deleteStatus(id,this.props.statuses.listStart,this.props.statuses.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openEditModal(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'StatusContainer::openEditModal',msg:"id " + id});
			this.setState({isEditModalOpen:true});
			this.props.actions.statusPage();
			if (id != null) {
				this.props.actions.status(id);
			} else {
				this.props.actions.clearStatus();
			}
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedStatusId:id,selectedName:name});
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
		fuLogger.log({level:'TRACE',loc:'StatusContainer::render',msg:"Hi there"});
		if (this.props.statuses.items != null) {
			return (
				<StatusView 
				containerState={this.state}
				statuses={this.props.statuses}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openEditModal={this.openEditModal}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onSaveStatus={this.onSaveStatus}
				onDeleteStatus={this.onDeleteStatus}
				inputChange={this.inputChange}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
	}
}

StatusContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	statuses: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, statuses:state.statuses};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(statusActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(StatusContainer);
