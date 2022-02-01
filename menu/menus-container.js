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
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import * as menusActions from './menus-actions';
import fuLogger from '../../core/common/fu-logger';
import MenuView from '../../adminView/menu/menu-view';
import MenuModifyView from '../../adminView/menu/menu-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Menu Page
*/
function MenuContainer() {
	const menus = useSelector((state) => state.menus);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(menusActions.init());
	}, []);

	const getState = () => {
		return menus;
	}
	
	const getForm = () => {
		return "ADMIN_MENU_FORM";
	}	

	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'MenuContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
	}
	
	fuLogger.log({level:'TRACE',loc:'MenuContainer::render',msg:"Hi there"});
	if (menus.isModifyOpen) {
		return (
			<MenuModifyView
			itemState={menus}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}
			/>
		);
	} else if (menus.items != null) {
		return (
			<MenuView 
			itemState={menus}
			appPrefs={appPrefs}
			onListLimitChange={BaseContainer.onListLimitChange}
			onSearchChange={BaseContainer.onSearchChange}
			onSearchClick={BaseContainer.onSearchClick}
			onPaginationClick={BaseContainer.onPaginationClick}
			onOrderBy={BaseContainer.onOrderBy}
			closeModal={BaseContainer.closeModal}
			onOption={BaseContainer.onOption}
			session={session}
			/>	
		);
	} else {
		return (<div> Loading... </div>);
	}
}

export default MenuContainer;
