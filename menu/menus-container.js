/*
* Author Edward Seufert
*/
'use-strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as menusActions from './menus-actions';
import fuLogger from '../../core/common/fu-logger';
import MenuView from '../../adminView/menu/menu-view';

/*
* Menu Page
*/
class MenuContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {pageName:"ADMIN_MENU",orderCriteria:[{'orderColumn':'ADMIN_MENU_TABLE_TITLE','orderDir':'ASC'},{'orderColumn':'ADMIN_MENU_TABLE_CODE','orderDir':'ASC'}],
				isEditModalOpen: false, isDeleteModalOpen: false, errors:{}};
		this.onListLimitChange = this.onListLimitChange.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.onPaginationClick = this.onPaginationClick.bind(this);
		this.onColumnSort = this.onColumnSort.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onSaveMenu = this.onSaveMenu.bind(this);
		this.onDeleteMenu = this.onDeleteMenu.bind(this);
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
			let searchCriteria = {'searchValue':this.state['ADMIN_MENU_SEARCH_input'],'searchColumn':'ADMIN_MENU_TABLE_TITLE'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onPaginationClick(value) {
		return(event) => {
			fuLogger.log({level:'TRACE',loc:'MenuContainer::onPaginationClick',msg:"fieldName "+ value});
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_MENU_ListLimit');
			let listStart = 0;
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
			listStart = ((segmentValue - 1) * listLimit);
			this.setState({"ADMIN_MENU_PAGINATION":segmentValue});

			let searchCriteria = {'searchValue':this.state['ADMIN_MENU_SEARCH_input'],'searchColumn':'ADMIN_MENU_TABLE_TITLE'};
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
			let listLimit = utils.getListLimit(this.props.appPrefs,this.state,'ADMIN_MENU_ListLimit');
			let searchCriteria = {'searchValue':this.state[fieldName+'_input'],'searchColumn':'ADMIN_MENU_TABLE_TITLE'};
			this.props.actions.list(listStart,listLimit,searchCriteria,this.state.orderCriteria);
		};
	}

	onColumnSort(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'MenuContainer::onColumnSort',msg:"id " + id});
		};
	}
	
	onSaveMenu() {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'MenuContainer::onSaveMenu',msg:"test"});

			if (this.props.menus.selected != null && this.props.menus.selected.name != "" && this.props.menus.selected.code != "" ){
				this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
				let searchCriteria = {'searchValue':this.state['MENU_SEARCH_input'],'searchColumn':'MENU_TABLE_TITLE'};
				this.props.actions.saveMenu(this.props.languages.selected,this.props.menus.listStart,this.props.menus.listLimit,searchCriteria,this.state.orderCriteria);
			} else {
				let errors = {};
				if (this.props.languages.selected == null || this.props.menus.selected.name == null || this.props.menus.selected.name == "" ){
					errors.MENU_NAME_input = "Missing!";
				}
				if (this.props.languages.selected == null || this.props.menus.selected.code == null || this.props.menus.selected.code == "") {
					errors.MENU_CODE_input = "Missing!";
				}
				this.setState({errors:errors});
			}
		};
	}
	
	onDeleteMenu(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'MenuContainer::onDeleteMenu',msg:"test"+id});
			this.setState({isEditModalOpen:false,isDeleteModalOpen:false});
			let searchCriteria = {'searchValue':this.state['MENU_SEARCH_input'],'searchColumn':'MENU_TABLE_NAME'};
			this.props.actions.deleteLanguage(id,this.props.menus.listStart,this.props.menus.listLimit,searchCriteria,this.state.orderCriteria);
		};
	}
	
	openEditModal(id) {
		return (event) => {
			fuLogger.log({level:'TRACE',loc:'MenuContainer::openEditModal',msg:"id " + id});
			this.setState({isEditModalOpen:true});
			this.props.actions.menuPage();
			if (id != null) {
				this.props.actions.menu(id);
			} else {
				this.props.actions.clearMenu();
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
		fuLogger.log({level:'TRACE',loc:'MenuContainer::render',msg:"Hi there"});
		if (this.props.menus.items != null) {
			return (
				<MenuView 
				containerState={this.state}
				menus={this.props.menus}
				appPrefs={this.props.appPrefs}
				onListLimitChange={this.onListLimitChange}
				onSearchChange={this.onSearchChange}
				onSearchClick={this.onSearchClick}
				onPaginationClick={this.onPaginationClick}
				onColumnSort={this.onColumnSort}
				openEditModal={this.openEditModal}
				openDeleteMOdal={this.openDeleteModal}
				closeModal={this.closeModal}
				onSaveMenu={this.onSaveMenu}
				onDeleteMenu={this.onDeleteMenu}
				inputChange={this.inputChange}
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
	menus: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {appPrefs:state.appPrefs, menus:state.menus};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(menusActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(MenuContainer);
