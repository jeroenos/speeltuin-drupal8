import * as React from 'react';
import { List } from 'immutable';
import { pathOr } from 'ramda';
import { TZO, VerdictList } from '../types'

const classNames = require('classnames');

export interface Props {
  data: List<TZO>,
  verdicts: VerdictList
}

function ListView({ data, verdicts }: Props) {
  return (
    <div className="bedrijfsinspecie-wrapper">
      <ul className="lijst-resultaten bedrijven">
        {data.map((tzo: TZO) => (
          <li className="bedrijfsinspectie-row" key={tzo.nid}>
          <div className="views-field views-field-nothing">
            <span className={classNames([
                "field-content",
                pathOr('', ['color'], verdicts.get(tzo.verdict)).toLowerCase()
              ])}>
              <a href={tzo.url} className="inspection-title">
                <h3>{tzo.title}</h3>
                <p className="inspection-result">{verdicts.get(tzo.verdict) && verdicts.get(tzo.verdict).name}</p>
              </a>{tzo.hasReply && (
                <a className="reactie-ondernemer" href={tzo.url}>
                  <img src="/themes/custom/nvwair_thema/presentation/images/svg/reactie_icon.svg" alt="reactie ondernemer" />
                </a>
              )}
            </span>
          </div>
          <div className="views-field views-field-field-reactie">
            <div className="field-content"></div>
          </div>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default ListView;
