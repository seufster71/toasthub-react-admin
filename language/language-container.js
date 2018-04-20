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


class LanguageContainer extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.props.actions.initLanguages();
	}

	onClick(code,index) {
    fuLogger.log({level:'TRACE',loc:'UsersContainer::onClick',msg:"clicked " + code});

  }

  render() {
			fuLogger.log({level:'TRACE',loc:'LanguageContainer::render',msg:"Hi there"});
      return (
				<LanguageView languages={this.props.languages}/>
			);
  }
}

LanguageContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	languages: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs, languages:state.languages};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(languageActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(LanguageContainer);
