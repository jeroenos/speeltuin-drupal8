import { Map, List } from 'immutable';
export enum ViewMode { Map, List };

export interface Filter {
  title: string;
  verdict: string;
  address: string;
}

export interface TZO {
  nid: string,
  url: string,
  title: string;
  verdict: string;
  address: {
    street: string;
    zip: string;
    city: string;
  }
  hasReply: boolean;
  geom: {
    lat: number,
    lng: number
  }
}

export interface Verdict {
  tid: string;
  name: string;
  color?: string;
  weight: string;
}

export type TZOList = Map<string, TZO>

export type VerdictList = Map<string, Verdict>

export interface StoreState {
  themaId: string;
  viewMode: ViewMode;
  filter: Filter;
  data: TZOList;
  verdicts: VerdictList;
  filteredData: List<string>;
  loading: boolean;
  currentPage: number;
}
