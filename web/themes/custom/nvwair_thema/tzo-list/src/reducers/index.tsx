import { AppAction } from '../actions';
import { StoreState, ViewMode, Verdict } from '../types/index';
import {
  SET_VIEW_MODE_LIST,
  SET_VIEW_MODE_MAP,
  RECEIVE_DATA,
  APPLY_FILTER,
  UPDATE_FILTER,
  RESTORE_FILTER,
  RECEIVE_VERDICTS,
  LOAD_DATA,
  SELECT_PAGE,
  CITY_ALT_NAMES,
} from '../constants/index';
import { List, Map } from 'immutable';

export default function(state: StoreState, action: AppAction): StoreState {
  switch (action.type) {
    case SET_VIEW_MODE_LIST:
      return { ...state, viewMode: ViewMode.List };
    case SET_VIEW_MODE_MAP:
      return { ...state, viewMode: ViewMode.Map };
    case RECEIVE_DATA:
      return {
        ...state,
        data: action.data,
        filteredData: List(),
        loading: false,
        currentPage: 0
      }
    case APPLY_FILTER:
      return {
        ...state,
        currentPage: 0,
        filteredData: state.data.keySeq().filter((nid: string) => {
          const tzo = state.data.get(nid);
          const filter = state.filter;
          let cityName = tzo.address.city;
          if (CITY_ALT_NAMES[cityName]) {
            cityName += ', ' + CITY_ALT_NAMES[cityName].join(', ');
          }
          if (filter.title.trim() && tzo.title.toLowerCase().indexOf(filter.title.toLowerCase()) === -1) {
            return false;
          }
          if (filter.verdict && tzo.verdict !== filter.verdict) {
            return false;
          }
          if (filter.address.trim()
            && tzo.address.zip.toLowerCase().indexOf(filter.address.toLowerCase()) === -1
            && cityName.toLowerCase().indexOf(filter.address.toLowerCase()) === -1
          ) {
            return false;
          }
          return true;
        }).toList()
      }
    case LOAD_DATA:
      return {
        ...state,
        loading: true
      }
    case UPDATE_FILTER:
      const filter = {
        ...state.filter,
        [action.name]: action.value
      }
      localStorage.setItem(`tzo:filter:${state.themaId}`, JSON.stringify(filter));
      return {
        ...state,
        filter
      }
    case RESTORE_FILTER:
      const filterData = localStorage.getItem(`tzo:filter:${state.themaId}`);
      if (!filterData) {
        return state;
      }
      return {
        ...state,
        filter: JSON.parse(filterData)
      }
    case RECEIVE_VERDICTS:
      const verdicts: {[key: string]: Verdict} = {};
      action.verdicts.forEach((v: Verdict) => {
        verdicts[v.tid] = v;
      });
      return {
        ...state,
        verdicts: Map(verdicts)
      }
    case SELECT_PAGE:
      return {
        ...state,
        currentPage: action.pageNumber
      }
  }
  return state;
}
