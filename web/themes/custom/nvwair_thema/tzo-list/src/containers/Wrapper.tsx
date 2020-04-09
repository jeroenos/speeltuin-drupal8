import Wrapper from '../components/Wrapper';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

export function mapStateToProps({ viewMode, loading }: StoreState) {
  return {
    viewMode,
    loading,
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AppAction>) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
