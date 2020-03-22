/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from "react-router";
import * as preferencesActions from './preferences-actions';
import fuLogger from '../../core/common/fu-logger';
import PreferencesView from '../../adminView/preferences/preferences-view';
import utils from '../../core/common/utils';

/*
* Preferences Page
*/
class PreferencesContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_PREFERENCE",isDeleteModalOpen: false, errors:null, warns:null, successes:null};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onOrderBy = this.onOrderBy.bind(this);
		this.onFilterClick = this.onFilterClick.bind(this);
		this.onSaveFilter = this.onSaveFilter.bind(this);
		this.onClearFilter = this.onClearFilter.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onModify = this.onModify.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onClickTabItem = this.onClickTabItem.bind(this);
		this.onToggleItem = this.onToggleItem.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentDidMount() {
		fuLogger.log({level:'TRACE',loc:'PreferenceContainer::componentDidMount',msg:"path "+ this.props.history.location.pathname });
		let category = "PUBLIC";
		if (this.props.history.location.pathname === "/admin-prefmember") {
			category = "MEMBER";
		} else if (this.props.history.location.pathname === "/admin-prefadmin") {
			category = "ADMIN";
		}
		this.props.actions.init(category);
	}
	
	componentDidUpdate() {
		fuLogger.log({level:'TRACE',loc:'PreferenceContainer::componentDidUpdate',msg:"path "+ this.props.history.location.pathname});
		// check to see if category has changed if so reload.
		
		
	}

	onListLimitChange(fieldName) {
		return (event) => {
			let value = 20;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
			} else {
				value = event.target.value;
			}

			let pageLimit = parseInt(value);
			this.props.actions.listLimit({state:this.props.preferences,listLimit});
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPaginationClick',msg:"fieldName "+ value});
			let listStart = this.props.preferences.listStart;
			let segmentValue = 1;
			let oldValue = 1;
			if (this.state["ADMIN_PREFERENCE_PAGINATION"] != null && this.state["ADMIN_PREFERENCE_PAGINATION"] != ""){
				oldValue = this.state["ADMIN_PREFERENCE_PAGINATION"];
			}
			if (value === "prev") {
				segmentValue = oldValue - 1;
			} else if (value === "next") {
				segmentValue = oldValue + 1;
			} else {
				segmentValue = value;
			}
			listStart = ((segmentValue - 1) * this.props.preferences.listLimit);
			this.setState({"ADMIN_PREFERENCE_PAGINATION":segmentValue});

			this.props.actions.list({state:this.props.preferences,listStart});
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
		if (fieldName === 'ADMIN_PREFERENCE-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_PREFERENCE-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.preferences.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_PREFERENCE-SEARCH'];
				option.searchColumn = this.props.preferences.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.preferences,searchCriteria});
	}
	
	onOrderBy(selectedOption) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferenceContainer::onOrderBy',msg:"id " + selectedOption});
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
				let option = {orderColumn:"ADMIN_PREFERENCE_TABLE_NAME",orderDir:"ASC"};
				orderCriteria.push(option);
			}
			this.props.actions.orderBy({state:this.props.preferences,orderCriteria});
		};
	}

	onFilterClick(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onFilterClick',msg:JSON.stringify(this.state)});
			this.setState({isFilterModalOpen:true});
		};
	}

	onSaveFilter(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSaveFilter',msg:JSON.stringify(this.state)});
		};
	}

	onClearFilter(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onClearFilter',msg:JSON.stringify(this.state)});
		};
	}


	onSave() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSavePreference',msg:"test"});
			let errors = utils.validateFormFields(this.props.preferences.appForms.ADMIN_PERFERENCE_FORM, this.props.preferences.inputFields, this.props.appPrefs.appGlobal.LANGUAGES);
			
			if (errors.isValid){
				this.props.actions.savePreference({state:this.props.preferences});
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
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onModify',msg:"item id "+id});
			this.props.actions.role(id);
		};
	}
	
	onDelete(item) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onDelete',msg:"item id " + item.id});
			this.setState({isDeleteModalOpen:false});
			this.props.actions.deleteRole({state:this.props.preferences,id:item.id});
		};
	}

	openDeleteModal(item) {
		return (event) => {
			this.setState({isDeleteModalOpen:true,selected:item});
		};
	}

	closeModal() {
		return (event) => {
			this.setState({isDeleteModalOpen:false,errors:null,warns:null});
		};
	}

	onCancel() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferenceContainer::onCancel',msg:"test"});
			this.props.actions.list({state:this.props.preferences});
		};
	}
	
	inputChange(fieldName,switchValue) {
		return (event) => {
			utils.inputChange(this.props,fieldName,switchValue);
		};
	}
	
	onClickTabItem(itemId,tabId) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onClickTabItem',msg:JSON.stringify(this.state)});
		};
	}

	onToggleItem(itemId) {
		return (event) => {
			if (this.state.openedItems != null && this.state.openedItems[itemId] != null) {
				let openedItems = {...this.state.openedItems};
				delete openedItems[itemId];
				this.setState({openedItems});
			} else {
				this.setState({openedItems:{ ...this.state.openedItems,[itemId]:{activeTab:"Fields"}}});
			}
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onToggleItem',msg:JSON.stringify(this.state)});
		};
	}

  render() {
		fuLogger.log({level:'TRACE',loc:'PreferencesContainer::render',msg:"test " + JSON.stringify(this.state)});
		if (this.props.preferences.items != null) {
      return (
				<PreferencesView
				containerState={this.state}
				items={this.props.preferences}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				onFilterClick={this.onFilterClick}
				onSaveFilter={this.onSaveFilter}
				onClearFilter={this.onClearFilter}
				onDelete={this.onDelete}
				onModify={this.onModify}
				openDeleteModal={this.openDeleteModal}
				closeModal={this.closeModal}
				onClickTabItem={this.onClickTabItem}
				onToggleItem={this.onToggleItem}
				inputChange={this.inputChange}/>
			);
		} else {
			return (<div> Loading </div>);
		}
  }
}

PreferencesContainer.propTypes = {
	appPrefs: PropTypes.object,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	codeType: PropTypes.string,
	preferences: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, preferences:state.preferences};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(preferencesActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(PreferencesContainer);
