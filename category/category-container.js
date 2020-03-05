/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as categoryActions from './category-actions';
import fuLogger from '../../core/common/fu-logger';
import CategoryView from '../../adminView/category/category-view';


class CategoryContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_CATEGORY",orderCriteria:[{'orderColumn':'ADMIN_CATEGORY_TABLE_NAME','orderDir':'ASC'},{'orderColumn':'ADMIN_CATEGORY_TABLE_CODE','orderDir':'ASC'}],
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
			let searchCriteria = {'searchValue':this.state['ADMIN_CATEGORY_SEARCH_input'],'searchColumn':'ADMIN_CATEGORY_TABLE_NAME'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'CategoryContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_CATEGORY_ListLimit');
			let listStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_CATEGORY_PAGINATION"] != null && this.state["ADMIN_CATEGORY_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_CATEGORY_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_CATEGORY_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_CATEGORY_SEARCH_input'],'searchColumn':'ADMIN_CATEGORY_TABLE_NAME'};
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
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_CATEGORY_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_CATEGORY_TABLE_NAME'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'CategoryContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'CategoryContainer::onSaveCategory',msg:"test"});

			let errors = utils.validateFormFields(this.props.users.appForms.ADMIN_USER_FORM,this.props.users.inputFields);
			
			if (errors.isValid){
				let searchCriteria = {'searchValue':this.state['CATEGORY_SEARCH_input'],'searchColumn':'CATEGORY_TABLE_NAME'};
				this.props.actions.saveCategory(this.props.category.inputFields,this.props.category.listStart,this.props.category.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				this.setState({errors:errors});
			}
		};
	}
	
	onModify(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'CategoryContainer::onModify',msg:"test"+id});
			this.props.actions.category(id);
		};
	}
	
	onDelete(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'CategoryContainer::onDeleteCategory',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['CATEGORY_SEARCH_input'],'searchColumn':'CATEGORY_TABLE_NAME'};
			this.props.actions.deleteLanguage(id,this.props.category.listStart,this.props.category.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openDeleteModal(id,name) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selectedLanguageId:id,selectedName:name});
		}
	}
	
	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}
	
	inputChange(fieldName) {
		return (event) => {
			let	value = event.target.value;
			this.props.actions.inputChange(fieldName,value);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::render',msg:"Hi there"});
		if (this.props.category.isModifyOpen) {
			return (
				<CategoryModifyView
				containerState={this.state}
				category={this.props.category.selected}
				inputFields={this.props.category.inputFields}
				appPrefs={this.props.appPrefs}
				userAppForms={this.props.category.appForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				/>
			);
		} else if (this.props.category.items != null) {
			return (
				<CategoryView 
				containerState={this.state}
				category={this.props.category}
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
				inputChange={this.inputChange}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
  }
}

CategoryContainer.propTypes = {
	appPrefs: PropTypes.object,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	category: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, category:state.category};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(categoryActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(CategoryContainer);
