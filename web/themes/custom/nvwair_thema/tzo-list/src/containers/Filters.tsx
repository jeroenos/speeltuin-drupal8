import Filters from '../components/Filters';
import * as actions from '../actions';
import { StoreState } from '../types/index';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

export function mapStateToProps({ viewMode, filter, verdicts }: StoreState) {
  return { viewMode, filter, verdicts }
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({
    onSetViewModeList: actions.setViewModeList,
    onSetViewModeMap: actions.setViewModeMap,
    updateFilter: actions.updateFilter,
    applyFilter: actions.applyFilter
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
