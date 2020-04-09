import MapView from '../components/MapView';
import { StoreState } from '../types/index';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

export function mapStateToProps({ data, filteredData, verdicts }: StoreState) {
  return {
    data,
    filteredData,
    verdicts
  }
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
