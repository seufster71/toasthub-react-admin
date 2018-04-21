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


class CategoryContainer extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.props.actions.initCategory();
	}

	onClick(code,index) {
		fuLogger.log({level:'TRACE',loc:'UsersContainer::onClick',msg:"clicked " + code});

	}

  render() {
			fuLogger.log({level:'TRACE',loc:'CategoryContainer::render',msg:"Hi there"});
      return (
				<CategoryView category={this.props.category}/>
			);
  }
}

CategoryContainer.propTypes = {
	appPrefs: PropTypes.object,
	lang: PropTypes.string,
	appGlobal: PropTypes.object,
	actions: PropTypes.object,
	category: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {lang:state.lang, appPrefs:state.appPrefs, category:state.category};
}

function mapDispatchToProps(dispatch) {
  return { actions:bindActionCreators(categoryActions,dispatch) };
}

export default connect(mapStateToProps,mapDispatchToProps)(CategoryContainer);
