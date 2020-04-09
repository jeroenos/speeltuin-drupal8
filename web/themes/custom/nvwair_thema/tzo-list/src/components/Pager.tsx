import * as React from 'react';
import 'core-js/es6/array';
import { ITEMS_PER_PAGE } from 'src/constants'

const classNames = require('classnames');

const MAX_PAGES = 10;

export interface Props {
  currentPage: number;
  numberOfPages: number;
  selectPage: (pageNumber: number) => void;
}

function Pager({ currentPage, numberOfPages, selectPage }: Props) {
  let pageRange = Array.from(Array(numberOfPages).keys());
  if (pageRange.length > MAX_PAGES) {
    let start = currentPage - Math.floor(MAX_PAGES / 2);
    if (start < 0) start = 0;
    if (start + Math.ceil(MAX_PAGES / 2) > numberOfPages) start = (numberOfPages - MAX_PAGES);
    pageRange = pageRange.slice(start, start + ITEMS_PER_PAGE);
  }
  function selectPageHandler(pageNumber: number): (e: React.MouseEvent<HTMLAnchorElement>) => void {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      selectPage(pageNumber);
    }
  }

  if (numberOfPages < 2) {
    return <div></div>
  }
  return (
    <nav className="pager paging-menu">
      <h4 id="pagination-heading" className="visually-hidden">Paginering</h4>
      <ul className="pager__items paging">
        {currentPage >= 1 && (
          <li className="pager__items pager_item--previous">
            <a href="#" onClick={selectPageHandler(currentPage - 1)}>Vorige</a></li>
        )}
        {pageRange.map((p: number) => {
          return (
            <li className={classNames(["pager__item", {"is-active": (p === currentPage)}])} key={p}>
              <a href="#" onClick={selectPageHandler(p)}>{p + 1}</a>
            </li>
          )
        })}
        {(currentPage < numberOfPages) && (
          <li className="pager__items pager_item--next">
            <a href="#" onClick={selectPageHandler(currentPage + 1)}>Volgende</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pager;
