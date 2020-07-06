/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
import utils from '../../core/common/utils';


class CategoryContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_CATEGORY", isDeleteModalOpen: false, errors:null, warns:null, successes:null};
	}

	componentDidMount() {
		this.props.actions.init();
	}

	onListLimitChange = (fieldName, event) => {
		let value = 20;
		if (this.props.codeType === 'NATIVE') {
			value = event.nativeEvent.text;
		} else {
			value = event.target.value;
		}

		let listLimit = parseInt(value);
		this.props.actions.listLimit({state:this.props.category,listLimit});
	}

	onPaginationClick = (value) => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.category.listStart;
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
		listStart = ((segmentValue - 1) * this.props.category.listLimit);
		this.setState({"ADMIN_CATEGORY_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.category,listStart});
	}

	onSearchChange = (fieldName, event) => {
		if (event.type === 'keypress') {
			if (event.key === 'Enter') {
				this.onSearchClick(fieldName,event);
			}
		} else {
			if (this.props.codeType === 'NATIVE') {
				this.setState({[fieldName]:event.nativeEvent.text});
			} else {
				this.setState({[fieldName]:event.target.value});
			}
		}
	}

	onSearchClick = (fieldname, event) => {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_CATEGORY-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_CATEGORY-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.category.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_CATEGORY-SEARCH'];
				option.searchColumn = this.props.category.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}
		
		this.props.actions.search({state:this.props.category.searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onOrderBy',msg:"id " + selectedOption});
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
			let option = {orderColumn:"ADMIN_CATEGORY_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.category,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onSaveCategory',msg:"test"});

		let errors = utils.validateFormFields(this.props.category.prefForms.ADMIN_CATEGORY_FORM,this.props.category.inputFields);
		
		if (errors.isValid){
			this.props.actions.saveCategory({state:this.props.category});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onModify',msg:"test"+id});
		this.props.actions.category(id);
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onDelete',msg:"test"});
		this.setState({isDeleteModalOpen:false});
		if (item != null && item.id != "") {
			this.props.actions.deleteLanguage({state:this.props.category,id:item.id});
		}
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.category});
	}
	
	inputChange = (fieldName,switchValue) => {
		utils.inputChange(this.props,fieldName,switchValue);
	}

	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onOption',msg:" code "+code});
		switch(code) {
			case 'MODIFY': {
				this.onModify(item);
				break;
			}
			case 'DELETE': {
				this.openDeleteModal(item);
				break;
			}
			case 'DELETEFINAL': {
				this.onDelete(item);
				break;
			}
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::render',msg:"Hi there"});
		if (this.props.category.isModifyOpen) {
			return (
				<CategoryModifyView
				containerState={this.state}
				item={this.props.category.selected}
				inputFields={this.props.category.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.category.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				/>
			);
		} else if (this.props.category.items != null) {
			return (
				<CategoryView 
				containerState={this.state}
				itemState={this.props.category}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onOrderBy={this.onOrderBy}
				closeModal={this.closeModal}
				onOption={this.onOption}
				inputChange={this.inputChange}
				session={this.props.session}
				/>
					
			);
		} else {
			return (<div> Loading... </div>);
		}
  }
}

CategoryContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	category: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, category:state.category, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(categoryActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(CategoryContainer);
