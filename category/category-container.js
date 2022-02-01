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
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import * as categoryActions from './category-actions';
import fuLogger from '../../core/common/fu-logger';
import CategoryModifyView from '../../adminView/category/category-modify-view';
import CategoryView from '../../adminView/category/category-view';
import BaseContainer from '../../core/container/base-container';

function CategoryContainer() {
	const category = useSelector((state) => state.category);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(categoryActions.init());
	}, []);

	const getState = () => {
		return category;
	}
	
	const getForm = () => {
		return "ADMIN_CATEGORY_FORM";
	}

	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'CategoryContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
	}
	
	fuLogger.log({level:'TRACE',loc:'CategoryContainer::render',msg:"Hi there"});
	if (category.isModifyOpen) {
		return (
			<CategoryModifyView
			itemState={category}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}
			/>
		);
	} else if (category.items != null) {
		return (
			<CategoryView 
			itemState={category}
			appPrefs={appPrefs}
			onListLimitChange={BaseContainer.onListLimitChange}
			onSearchChange={BaseContainer.onSearchChange}
			onSearchClick={BaseContainer.onSearchClick}
			onPaginationClick={BaseContainer.onPaginationClick}
			onOrderBy={BaseContainer.onOrderBy}
			closeModal={BaseContainer.closeModal}
			onOption={onOption}
			inputChange={BaseContainer.inputChange}
			session={session}
			/>
				
		);
	} else {
		return (<div> Loading... </div>);
	}
}

export default CategoryContainer;
