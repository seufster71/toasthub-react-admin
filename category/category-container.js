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
import CategoryModifyView from '../../adminView/category/category-modify-view';
import CategoryView from '../../adminView/category/category-view';
import BaseContainer from '../../core/container/base-container';

class CategoryContainer extends BaseContainer {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.actions.init();
	}

	getState = () => {
		return this.props.category;
	}
	
	getForm = () => {
		return "ADMIN_CATEGORY_FORM";
	}

	onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onOption',msg:" code "+code});
		if (this.onOptionBase(code,item)) {
			return;
		}
	}
	
	render() {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::render',msg:"Hi there"});
		if (this.props.category.isModifyOpen) {
			return (
				<CategoryModifyView
				itemState={this.props.category}
				appPrefs={this.props.appPrefs}
				onSave={this.onSave}
				onCancel={this.onCancel}
				inputChange={this.inputChange}
				/>
			);
		} else if (this.props.category.items != null) {
			return (
				<CategoryView 
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
