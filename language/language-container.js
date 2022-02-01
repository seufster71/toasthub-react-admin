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
import * as languageActions from './language-actions';
import fuLogger from '../../core/common/fu-logger';
import LanguageView from '../../adminView/language/language-view';
import LanguageModifyView from '../../adminView/language/language-modify-view';
import BaseContainer from '../../core/container/base-container';

/*
* Language Page
*/
function LanguageContainer() {
	const pmteam = useSelector((state) => state.pmteam);
	const session = useSelector((state) => state.session);
	const appMenus = useSelector((state) => state.appMenus);
	const appPrefs = useSelector((state) => state.appPrefs);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		dispatch(languageActions.init());
	}, []);
	
	const getState = () => {
		return languages;
	}
	
	const getForm = () => {
		return "ADMIN_LANGUAGE_FORM";
	}	
	
	
	const onOption = (code,item) => {
		fuLogger.log({level:'TRACE',loc:'LanguageContainer::onOption',msg:" code "+code});
		if (BaseContainer.onOptionBase(code,item)) {
			return;
		}
	}

	fuLogger.log({level:'TRACE',loc:'LanguageContainer::render',msg:"Hi there"});
	if (languages.isModifyOpen) {
		return (
			<LanguageModifyView
			itemState={languages}
			appPrefs={appPrefs}
			onSave={BaseContainer.onSave}
			onCancel={BaseContainer.onCancel}
			inputChange={BaseContainer.inputChange}/>
		);
	} else if (languages.items != null) {
		return (
			<LanguageView 
			itemState={languages}
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

export default LanguageContainer;
