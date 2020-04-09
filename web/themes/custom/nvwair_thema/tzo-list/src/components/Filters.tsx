import * as React from 'react';
import { ViewMode, Filter, VerdictList, Verdict } from 'src/types';

const classNames = require('classnames');

export interface Props {
  viewMode: ViewMode,
  filter: Filter,
  verdicts: VerdictList,
  updateFilter: (name:string, value:string) => void,
  applyFilter: () => void
  onSetViewModeList: () => void,
  onSetViewModeMap: () => void
}

function sortByWeight(a: Verdict, b: Verdict): number {
  if (parseInt(a.weight) > parseInt(b.weight)) return 1;
  if (parseInt(a.weight) < parseInt(b.weight)) return -1;
  return 0;
}

function Filters({ onSetViewModeList, onSetViewModeMap, updateFilter, viewMode, verdicts, applyFilter, filter }: Props) {
  return (
    <div className="inspectiersultaten-filters">
      <form className="views-exposed-form bef-exposed-form" id="views-exposed-form-inspectieresultaten-block-1" acceptCharset="UTF-8">
        <div className="formWrapper">
          <fieldset id="filters">
            <legend>Filters</legend>
            <div id="toezichtFilter" className="filters-wrapper">
              <div className="js-form-item form-item js-form-type-textfield form-item-field-bedrijf-value js-form-item-field-bedrijf-value">
                <label htmlFor="edit-field-bedrijf-value">Zoeken op naam</label>
                <div className="inputfield-wrapper">
                  <input
                    type="text"
                    id="edit-field-bedrijf-value"
                    name="field_bedrijf_value"
                    value={filter.title}
                    size={30}
                    maxLength={128}
                    className="form-text"
                    onChange={e => updateFilter('title', e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyFilter();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="js-form-item form-item js-form-type-select form-item-field-bedrijfsoordeel-target-id js-form-item-field-bedrijfsoordeel-target-id">
                <label htmlFor="edit-field-bedrijfsoordeel-target-id">Beoordeling</label>
                <select
                  value={filter.verdict}
                  id="edit-field-bedrijfsoordeel-target-id"
                  name="field_bedrijfsoordeel_target_id"
                  className="form-select"
                  onChange={async (e) => {
                    await updateFilter('verdict', e.target.value)
                    applyFilter();
                  }}
                >
                  <option value="">- Alle -</option>
                  {verdicts.sort(sortByWeight).map((verdict: Verdict) => (
                    <option value={verdict.tid} key={verdict.tid}>{verdict.name}</option>
                  )).toIndexedSeq()}
                </select>
              </div>
              <div className="js-form-item form-item js-form-type-textfield form-item-combine js-form-item-combine">
                <label htmlFor="edit-combine">Plaats of postcode</label>
                <div className="inputfield-wrapper">
                  <input
                    type="text"
                    id="edit-combine"
                    name="combine"
                    value={filter.address}
                    size={30}
                    maxLength={128}
                    className="form-text"
                    onChange={e => updateFilter('address', e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyFilter();
                      }
                    }}
                  />
                </div>
              </div>
              <div data-drupal-selector="edit-actions" className="form-actions js-form-wrapper form-wrapper" id="edit-actions">
               <div className="inputfield-wrapper">
                <input 
                   data-bef-auto-submit-click="" 
                   className="button js-form-submit form-submit" 
                   type="submit" 
                   id="edit-submit-inspectieresultaten" 
                   value="Toepassen"
                   onClick={e => {
                      e.preventDefault();
                      applyFilter();
                   }}
                />
              </div>
            </div>
            <div className="view">
              <label htmlFor="">Weergave</label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSetViewModeList();
                }}
                className={classNames({
                  "list": true,
                  "listMapSwitch": true,
                  "is-active":  (viewMode === ViewMode.List)
                })}
              >
                Lijst
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSetViewModeMap();
                }}
                className={classNames({
                  "list": true,
                  "listMapSwitch": true,
                  "is-active":  (viewMode === ViewMode.Map)
                })}
              >
                Kaart
              </a>
            </div>
          </div>
        </fieldset>
      </div>
    </form>
  </div>
  );
}

export default Filters;
