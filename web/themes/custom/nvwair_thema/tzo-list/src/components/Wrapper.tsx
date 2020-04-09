import * as React from 'react';
import { ViewMode } from '../types';
import Filters from '../containers/Filters';
import ListView from '../containers/ListView';
import MapView from '../containers/MapView';
import Pager from '../containers/Pager';

export interface Props {
  viewMode: ViewMode;
  loading: boolean;
}

function Wrapper({ viewMode, loading }: Props) {
  if (loading) {
    return (
      <div className="ajax-progress ajax-progress-fullscreen loading"></div>
    )
  }
  return (
    <div className="views-element-container" id="block-views-block-inspectieresultaten-block-1">
      <Filters />
      {(viewMode === ViewMode.List) ? [<ListView key={0} />, <Pager key={1} />] : <MapView />}
    </div>
  );
}

export default Wrapper;
