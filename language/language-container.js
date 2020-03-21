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
		this.state = {pageName:"ADMIN_LANGUAGE",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onOrderBy = this.onOrderBy.bind(this);
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
			} else {
				value = event.target.value;
			}

			let listLimit = parseInt(value);
			this.props.actions.listLimit({state:this.props.languages,listLimit});
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onPaginationClick',msg:"fieldName "+ value});
			let listStart = this.props.languages.listStart;
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
			listStart = ((segmentValue - 1) * this.props.languages.listLimit);
			this.setState({"ADMIN_LANGUAGE_PAGINATION":segmentValue});

			this.props.actions.list({state:this.props.languages,listStart});
		};
	}

	onSearchChange(fieldName) {
		return (event) => {
			if (event.type === 'keypress' && event.key === 'Enter') {
				this.searchClick(fieldName,event);
			} else {
				if (this.props.codeType === 'NATIVE') {
					this.setState({[fieldName]:event.nativeEvent.text});
				} else {
					this.setState({[fieldName]:event.target.value});
				}
			}
		};
	}

	onSearchClick(fieldName) {
		return (event) => {
			this.searchClick(fieldName,event);
		};
	}

	searchClick(fieldName,event) {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_LANGUAGE-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_LANGUAGE-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.languages.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_LANGUAGE-SEARCH'];
				option.searchColumn = this.props.languages.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.languages,searchCriteria});
	}

	onOrderBy(selectedOption) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onOrderBy',msg:"id " + selectedOption});
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
				let option = {orderColumn:"ADMIN_LANGUAGE_TABLE_NAME",orderDir:"ASC"};
				orderCriteria.push(option);
			}
			this.props.actions.orderBy({state:this.props.languages,orderCriteria});
		};
	}
	
	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onSave',msg:"test"});
			let errors = utils.validateFormFields(this.props.languages.appForms.ADMIN_LANGUAGE_FORM, this.props.languages.inputFields, this.props.appPrefs.appGlobal.LANGUAGES);
			
			if (errors.isValid){
				this.props.actions.saveLanguage({state:this.props.languages});
			} else {
				this.setState({errors:errors.errorMap});
			}
		};
	}
	
	onModify(item) {
		return (event) => {
			let id = null;
			if (item != null && item.id != null) {
				id = item.id;
			}
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onModify',msg:"test"+id});
			this.props.actions.language(id);
		};
	}
	
	onDelete(item) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onDelete',msg:"test"});
			this.setState({isDeleteModalOpen:false});
			if (item != null && item.id != "") {
				this.props.actions.deleteLanguage({state:this.props.languages,id:item.id});
			}
		};
	}
	
	openDeleteModal(item) {
		return (event) => {
		    this.setState({isDeleteModalOpen:true,selected:item});
		}
	}
	
	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}
	
	onCancel() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::onCancel',msg:"test"});
			this.props.actions.list({state:this.props.languages});
		};
	}
	
	inputChange(fieldName,switchValue) {
		return (event) => {
			utils.inputChange(this.props,fieldName,switchValue);
		};
	}

	render() {
		fuLogger.log({level:'TRACE',loc:'LanguageContainer::render',msg:"Hi there"});
		if (this.props.languages.isModifyOpen) {
			return (
				<LanguageModifyView
				containerState={this.state}
				item={this.props.languages.selected}
				inputFields={this.props.languages.inputFields}
				appPrefs={this.props.appPrefs}
				itemAppForms={this.props.languages.appForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}/>
			);
		} else if (this.props.languages.items != null) {
			return (
				<LanguageView 
				containerState={this.state}
				items={this.props.languages}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				openDeleteModal={this.openDeleteModal}
				closeModal={this.closeModal}
				onModify={this.onModify}
				onDelete={this.onDelete}
				inputChange={this.inputChange}
				session={this.props.session}
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
  return {appPrefs:state.appPrefs, languages:state.languages, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(languageActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(LanguageContainer);
