import ListView from '../components/ListView';
import { StoreState } from '../types/index';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ITEMS_PER_PAGE } from '../constants';

export function mapStateToProps({ data, filteredData, verdicts, currentPage }: StoreState) {
  const start = currentPage * ITEMS_PER_PAGE;
  return {
    data: filteredData.slice(start, start + ITEMS_PER_PAGE).map((key: string) => data.get(key)),
    verdicts
  }
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
