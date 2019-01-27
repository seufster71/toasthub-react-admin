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
		this.state = {pageName:"ADMIN_PREFERENCE",orderCriteria:[{'orderColumn':'ADMIN_PREFERENCE_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_PREFERENCE_TABLE_CODE','orderDir':'ASC'}],
									isAddModalOpen: false, isDeleteModalOpen: false, isFilterModalOpen: false, isDeleteModalOpen: false, selectedId:null, openedItems:null};
		this.onPageLimitChange = this.onPageLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onFilterClick = this.onFilterClick.bind(this);
		this.onSaveFilter = this.onSaveFilter.bind(this);
		this.onClearFilter = this.onClearFilter.bind(this);
		this.onSavePreference = this.onSavePreference.bind(this);
		this.onDeletePreference = this.onDeletePreference.bind(this);
		this.onAddModal = this.onAddModal.bind(this);
		this.onDeleteModal = this.onDeleteModal.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onClickTabItem = this.onClickTabItem.bind(this);
		this.onToggleItem = this.onToggleItem.bind(this);
	}

	componentDidMount() {
		let orderCriteria = this.state.orderCriteria;
		this.props.actions.initPreferences(orderCriteria);
	}

	onPageLimitChange(fieldName) {
		return (event) => {
			let value = 20;
			if (this.props.codeType === 'NATIVE') {
				value = event.nativeEvent.text;
				this.setState({[fieldName]:parseInt(event.nativeEvent.text)});
			} else {
				value = event.target.value;
				this.setState({[fieldName]:parseInt(event.target.value)});
			}

			let pageStart = 0;
			let pageLimit = parseInt(value);
//			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPageLimitChange',msg:"pageLimit " + pageLimit});
			let searchCriteria = {'searchValue':this.state['ADMIN_PREFERENCE_SEARCH_input'],'searchColumn':'ADMIN_PREFERENCE_TABLE_DESC'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onPaginationClick',msg:"fieldName "+ value});
			let pageLimit = utils.getPageLimit(this.props.appPrefs,this.state,'ADMIN_PREFERENCE_PAGELIMIT');
			let pageStart = 0;
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
			pageStart = ((segmentValue - 1) * pageLimit);
			this.setState({"ADMIN_PREFERENCE_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_PREFERENCE_SEARCH_input'],'searchColumn':'ADMIN_PREFERENCE_TABLE_DESC'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
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
		//	fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSearchClick',msg:"the state " + JSON.stringify(this.state)});
			let pageStart = 0;
			let pageLimit = utils.getPageLimit(this.props.appPrefs,this.state,'ADMIN_PREFERENCE_PAGELIMIT');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_PREFERENCE_TABLE_DESC'};
			this.props.actions.list(pageStart,pageLimit,searchCriteria,this.state.orderCriteria);
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


	onSavePreference() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onSavePreference',msg:JSON.stringify(this.state)});
			this.closeModal();
		};
	}

	onDeletePreference() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onDeletePreference',msg:JSON.stringify(this.state)});
			this.closeModal();
		};
	}

	onAddModal() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onAddModal',msg:JSON.stringify(this.state)});
			this.setState({isAddModalOpen:true});
		};
	}

	onDeleteModal() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onDeleteModal',msg:JSON.stringify(this.state)});
			this.setState({isDeleteModalOpen:true});
		};
	}

	onCloseModal() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'PreferencesContainer::onCloseModal',msg:JSON.stringify(this.state)});
			this.setState({isAddModalOpen:false,isDeleteModalOpen:false,isFilterModalOpen:false,isDeleteModalOpen:false});
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
				preferences={this.props.preferences}
				appPrefs={this.props.appPrefs}
				onPageLimitChange={this.onPageLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onFilterClick={this.onFilterClick}
				onSaveFilter={this.onSaveFilter}
				onClearFilter={this.onClearFilter}
				onSavePreference={this.onSavePreference}
				onDeletePreference={this.onDeletePreference}
				onAddModal={this.onAddModal}
				onDeleteModal={this.onDeleteModal}
				onCloseModal={this.onCloseModal}
				onClickTabItem={this.onClickTabItem}
				onToggleItem={this.onToggleItem}/>
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
