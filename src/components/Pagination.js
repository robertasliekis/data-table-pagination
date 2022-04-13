import React from "react";

function Pagination({ pageCount, activePage, onActivePageChange }) {
  return (
    <div className="pagination-container">
      <div className={`btn-first-page ${activePage === 1 ? "disabled" : ""}`} onClick={() => onActivePageChange(1)}>
        First
      </div>
      <div className={`btn-previous-page ${activePage === 1 ? "disabled" : ""}`} onClick={() => activePage > 1 && onActivePageChange(activePage - 1)}>
        Prev
      </div>
      <div className="current-page">{`${activePage}/${pageCount}`}</div>
      <div className={`btn-next-page ${activePage === pageCount ? "disabled" : ""}`} onClick={() => activePage < pageCount && onActivePageChange(activePage + 1)}>
        Next
      </div>
      <div className={`btn-last-page ${activePage === pageCount ? "disabled" : ""}`} onClick={() => onActivePageChange(pageCount)}>
        Last
      </div>
    </div>
  );
}

export default Pagination;
