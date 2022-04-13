import React, { useState, useEffect } from "react";

import Pagination from "./components/Pagination";
import axios from "axios";
import "./App.css";

function App() {
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [loadedData, setLoadedData] = useState(null);
  const [perPageData, setPerPageData] = useState(null);

  const [activePage, setActivePage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const dataAmountPerPage = 20;

  const [showPagination, setShowPagination] = useState(true);

  const [selectedRow, setSelectedRow] = useState({ index: null, data: null });

  const [reverseColumn, setReverseColumn] = useState(null);

  const columnNames = ["name", "age", "city"];

  useEffect(() => {
    getDataFromAPI();
  }, []);

  useEffect(() => {
    //For pagination piece of data is sliced from all data, depending which page is active
    loadedData && setPerPageData(loadedData.slice(dataAmountPerPage * (activePage - 1), dataAmountPerPage * (activePage - 1) + dataAmountPerPage));
    setSelectedRow({ index: null });
  }, [activePage, loadedData]);

  const getDataFromAPI = () => {
    setDataLoading(true);
    const urlAPI = "https://api.npoint.io/c7c9b252e83fadb9077c";

    axios
      .get(urlAPI)
      .then((response) => {
        setDataLoading(false);
        let data = response.data;
        setLoadedData(data);
        setPageCount(Math.ceil(data.length / dataAmountPerPage));
      })
      .catch((err) => {
        setDataError(err.message);
        setDataLoading(false);
      });
  };

  const sortColumn = (columnName) => {
    let dataCopy = JSON.parse(JSON.stringify(loadedData));

    dataCopy.sort((a, b) => {
      if (columnName === "age") {
        return parseFloat(a[columnName]) - parseFloat(b[columnName]);
      } else return a[columnName].localeCompare(b[columnName]);
    });

    dataCopy = reverseColumnData(dataCopy, columnName);

    setLoadedData(dataCopy);
  };

  const activePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setSelectedRow({ index: null, data: null });
  };

  const handleCheckboxChange = (event) => {
    setShowPagination(event.target.checked);
    setSelectedRow({ index: null });
    setActivePage(1);
  };

  const reverseColumnData = (data, columnName) => {
    if (columnName === reverseColumn) {
      data.reverse();
      setReverseColumn(null);
    } else {
      setReverseColumn(columnName);
    }

    return data;
  };

  const displayedData = showPagination ? perPageData : loadedData;

  return (
    <div className="website-container">
      {dataLoading ? <h3>Data is loading...</h3> : null}
      {dataError ? <h3>{`Error: ${dataError}`}</h3> : null}
      {loadedData && perPageData ? (
        <div className="tables-container">
          <h3>Selected row</h3>
          <table>
            <tr>
              {columnNames.map((name) => (
                <th class={name}>{name}</th>
              ))}
            </tr>
            <tr>
              {columnNames.map((name) => (
                <td class={name}>{selectedRow.data && selectedRow.data[name]}</td>
              ))}
            </tr>
          </table>
          <div className="checkbox-container">
            <h3>Pagination</h3>
            <input type="checkbox" className="checkbox" checked={showPagination} onChange={handleCheckboxChange} />
          </div>
          <h3>API data</h3>
          <table>
            <tr>
              {columnNames.map((name) => (
                <th class={name} onClick={() => sortColumn(name)}>
                  {name}
                </th>
              ))}
            </tr>
            {displayedData.map((person, index) => (
              <tr
                key={index}
                className={index === selectedRow.index ? "selected" : ""}
                onClick={() => {
                  setSelectedRow({ index: index, data: person });
                }}
              >
                {columnNames.map((name) => (
                  <td class={name}>{person[name]}</td>
                ))}
              </tr>
            ))}
          </table>
          {showPagination ? <Pagination pageCount={pageCount} activePage={activePage} onActivePageChange={activePageChange} /> : null}
        </div>
      ) : null}
    </div>
  );
}

export default App;
