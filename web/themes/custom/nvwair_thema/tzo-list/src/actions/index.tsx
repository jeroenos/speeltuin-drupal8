import { Dispatch } from 'redux';
import { Map } from 'immutable';
import * as constants from '../constants';
import { TZOList, Verdict } from 'src/types';

export interface SetViewModeList {
  type: constants.SET_VIEW_MODE_LIST;
}

export interface SetViewModeMap {
  type: constants.SET_VIEW_MODE_MAP;
}

export interface ApplyFilter {
  type: constants.APPLY_FILTER;
}

export interface LoadData {
  type: constants.LOAD_DATA;
}

export interface ReceiveData {
  type: constants.RECEIVE_DATA;
  data: TZOList;
}

export interface ReceiveVerdicts {
  type: constants.RECEIVE_VERDICTS;
  verdicts: Array<Verdict>;
}

export interface UpdateFilter {
  type: constants.UPDATE_FILTER;
  name: string;
  value: string;
}

export interface RestoreFilter {
  type: constants.RESTORE_FILTER;
}

export interface SelectPage {
  type: constants.SELECT_PAGE;
  pageNumber: number
}

export type AppAction = SetViewModeList
  | SetViewModeMap
  | ApplyFilter
  | LoadData
  | ReceiveData
  | UpdateFilter
  | RestoreFilter
  | ReceiveVerdicts
  | SelectPage;

export function setViewModeList(): SetViewModeList {
  return {
    type: constants.SET_VIEW_MODE_LIST
  }
}

export function setViewModeMap(): SetViewModeMap {
  return {
    type: constants.SET_VIEW_MODE_MAP
  }
}

export function loadData(): LoadData {
  return {
    type: constants.LOAD_DATA
  }
}

export function receiveData(data: TZOList): ReceiveData {
  return {
    type: constants.RECEIVE_DATA,
    data
  }
}

export function receiveVerdicts(verdicts: Array<Verdict>): ReceiveVerdicts {
  return {
    type: constants.RECEIVE_VERDICTS,
    verdicts
  }
}

export function fetchData(themaId: string) {
  return async function(dispatch: Dispatch<AppAction>) {
    dispatch(loadData());
    const [listResponse, verdictsResponse]: [any, any] = await Promise.all([
      fetch(`/api/tzo/list/${themaId}`),
      fetch('/api/tzo/verdicts')
    ]);
    if (listResponse.ok && verdictsResponse.ok) {
      const listResult: {data: TZOList} = await listResponse.json();
      const verdictsResult: Array<Verdict> = await verdictsResponse.json();
      await dispatch(receiveData(Map(listResult.data)));
      await dispatch(receiveVerdicts(verdictsResult));
      return dispatch(applyFilter());
    } else {
      return dispatch(receiveData(Map()));
    }
  }
}

export function applyFilter(): ApplyFilter {
  return {
    type: constants.APPLY_FILTER
  }
}

export function updateFilter(name: string, value: string): UpdateFilter {
  return {
    type: constants.UPDATE_FILTER,
    name,
    value
  }
}

export function restoreFilter(): RestoreFilter {
  return {
    type: constants.RESTORE_FILTER,
  }
}

export function selectPage(pageNumber: number): SelectPage {
  return {
    type: constants.SELECT_PAGE,
    pageNumber
  }
}
