/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as languageActions from './language-actions';
import fuLogger from '../../core/common/fu-logger';
import LanguageView from '../../adminView/language/language-view';
import LanguageModifyView from '../../adminView/language/language-modify-view';
import utils from '../../core/common/utils';

/*
* Language Page
*/
class LanguageContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_LANGUAGE",orderCriteria:[{'orderColumn':'ADMIN_LANGUAGE_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_LANGUAGE_TABLE_CODE','orderDir':'ASC'}],
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
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
			let searchCriteria = {'searchValue':this.state['ADMIN_LANGUAGE_SEARCH_input'],'searchColumn':'ADMIN_LANGUAGE_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_LANGUAGE_ListLimit');
			let listStart = 0;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_LANGUAGE_PAGINATION"] != null && this.state["ADMIN_LANGUAGE_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_LANGUAGE_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_LANGUAGE_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_LANGUAGE_SEARCH_input'],'searchColumn':'ADMIN_LANGUAGE_TABLE_BOTH'};
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
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_LANGUAGE_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_LANGUAGE_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onSave',msg:"test"});

			if (this.props.languages.selected != null && this.props.languages.selected.name != "" && this.props.languages.selected.code != "" ){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['ADMIN_LANGUAGE_SEARCH_input'],'searchColumn':'ADMIN_LANGUAGE_TABLE_NAME'};
				this.props.actions.saveLanguage(this.props.languages.selected,this.props.languages.listStart,this.props.languages.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.languages.selected == null || this.props.languages.selected.name == null || this.props.languages.selected.name == "" ){
					errors.LANGUAGE_NAME_input = "Missing!";
				}
				if (this.props.languages.selected == null || this.props.languages.selected.code == null || this.props.languages.selected.code == "") {
					errors.LANGUAGE_CODE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onModify(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onModify',msg:"test"+id});
			this.props.actions.language(id);
		};
	}
	
	onDelete(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onDelete',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['ADMIN_LANGUAGE_SEARCH_input'],'searchColumn':'ADMIN_LANGUAGE_TABLE_NAME'};
			this.props.actions.deleteLanguage(id,this.props.languages.listStart,this.props.languages.listLimit,searchCriteria,this.state.orderCriteria);
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
	
	onCancel() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onCancel',msg:"test"});
			let listStart = 0;
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_LANGUAGE_ListLimit');
			let searchCriteria = {'searchValue':this.state['ADMIN_LANGUAGE_SEARCH_input'],'searchColumn':'ADMIN_LANGUAGE_TABLE_BOTH'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	inputChange(fieldName) {
		return (event) => {
			let	value = event.target.value;
			if (switchValue != null) {
				value = switchValue;
			}
			this.props.actions.inputChange(fieldName,value);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'LanguageContainer::render',msg:"Hi there"});
		if (this.props.languages.isModifyOpen) {
			return (
				<LanguageModifyView
				containerState={this.state}
				language={this.props.languages.selectedLanguage}
				inputFields={this.props.languages.inputFields}
				appPrefs={this.props.appPrefs}
				userAppForms={this.props.languages.appForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.languages.items != null) {
			return (
				<LanguageView 
				containerState={this.state}
				languages={this.props.languages}
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

LanguageContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	languages: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, languages:state.languages};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(languageActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(LanguageContainer);
