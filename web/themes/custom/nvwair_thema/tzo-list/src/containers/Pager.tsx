import Pager from '../components/Pager';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ITEMS_PER_PAGE } from 'src/constants'

export function mapStateToProps({ filteredData, currentPage }: StoreState) {
  return {
    currentPage,
    numberOfPages: Math.ceil(filteredData.count() / ITEMS_PER_PAGE)

  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return bindActionCreators({
    selectPage: actions.selectPage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pager);
