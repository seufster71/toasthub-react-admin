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
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as menusActions from './menus-actions';
import fuLogger from '../../core/common/fu-logger';
import MenuView from '../../adminView/menu/menu-view';
import MenuModifyView from '../../adminView/menu/menu-modify-view';
import utils from '../../core/common/utils';

/*
* Menu Page
*/
class MenuContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_MENU", isDeleteModalOpen: false, errors:null, warns:null, successes:null};
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
		this.props.actions.listLimit({state:this.props.menus,listLimit});
	}

	onPaginationClick= (value) => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onPaginationClick',msg:"fieldName "+ value});
		let listStart = this.props.menus.listStart;
		let segmentValue = 1;
		let oldValue = 1;
		if (this.state["ADMIN_MENU_PAGINATION"] != null && this.state["ADMIN_MENU_PAGINATION"] != ""){
			oldValue = this.state["ADMIN_MENU_PAGINATION"];
		}
		if (value === "prev") {
			segmentValue = oldValue - 1;
		} else if (value === "next") {
			segmentValue = oldValue + 1;
		} else {
			segmentValue = value;
		}
		listStart = ((segmentValue - 1) * this.props.menus.listLimit);
		this.setState({"ADMIN_MENU_PAGINATION":segmentValue});

		this.props.actions.list({state:this.props.menus,listStart});
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

	onSearchClick = (fieldName, event) => {
		let searchCriteria = [];
		if (fieldName === 'ADMIN_MENU-SEARCHBY') {
			if (event != null) {
				for (let o = 0; o < event.length; o++) {
					let option = {};
					option.searchValue = this.state['ADMIN_MENU-SEARCH'];
					option.searchColumn = event[o].value;
					searchCriteria.push(option);
				}
			}
		} else {
			for (let i = 0; i < this.props.menus.searchCriteria.length; i++) {
				let option = {};
				option.searchValue = this.state['ADMIN_MENU-SEARCH'];
				option.searchColumn = this.props.menus.searchCriteria[i].searchColumn;
				searchCriteria.push(option);
			}
		}

		this.props.actions.search({state:this.props.menus,searchCriteria});
	}

	onOrderBy = (selectedOption, event) => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onOrderBy',msg:"id " + selectedOption});
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
			let option = {orderColumn:"ADMIN_MENU_TABLE_NAME",orderDir:"ASC"};
			orderCriteria.push(option);
		}
		this.props.actions.orderBy({state:this.props.menus,orderCriteria});
	}
	
	onSave = () => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onSaveMenu',msg:"test"});
		let errors = utils.validateFormFields(this.props.menus.prefForms.ADMIN_MENU_FORM, this.props.menus.inputFields, this.props.appPrefs.prefGlobal.LANGUAGES);
		
		if (errors.isValid){
			this.props.actions.save({state:this.props.menus});
		} else {
			this.setState({errors:errors.errorMap});
		}
	}
	
	onModify = (item) => {
		let id = null;
		if (item != null && item.id != null) {
			id = item.id;
		}
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onModify',msg:"test"+id});
		this.props.actions.modifyItem({id,appPrefs:this.props.appPrefs});
	}
	
	onDelete = (item) => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onDelete',msg:"test"});
		this.setState({isDeleteModalOpen:false});
		if (item != null && item.id != "") {
			this.props.actions.deleteItem({state:this.props.menus,id:item.id});
		}
	}
	
	openDeleteModal = (item) => {
		this.setState({isDeleteModalOpen:true,selected:item});
	}
	
	closeModal = () => {
		this.setState({isDeleteModalOpen:false,errors:null,warns:null});
	}
	
	onCancel = () => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onCancel',msg:"test"});
		this.props.actions.list({state:this.props.menus});
	}
	
	inputChange = (fieldName,switchValue) => {
		utils.inputChange(this.props,fieldName,switchValue);
	}

	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onOption',msg:" code "+code});
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
		fuLogger.log({level:'TRACE',loc:'MenuContainer::render',msg:"Hi there"});
		if (this.props.menus.isModifyOpen) {
			return (
				<MenuModifyView
				containerState={this.state}
				item={this.props.menus.selected}
				inputFields={this.props.menus.inputFields}
				appPrefs={this.props.appPrefs}
				itemPrefForms={this.props.menus.prefForms}
				onSave={this.onSave}
				onCancel={this.onCancel}
				onReturn={this.onCancel}
				inputChange={this.inputChange}
				onBlur={this.onBlur}/>
			);
		} else if (this.props.menus.items != null) {
			return (
				<MenuView 
				containerState={this.state}
				itemState={this.props.menus}
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

MenuContainer.propTypes = {
	appPrefs: PropTypes.object,
	actions: PropTypes.object,
	menus: PropTypes.object,
	session: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, menus:state.menus, session:state.session};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(menusActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(MenuContainer);
