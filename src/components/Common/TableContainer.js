import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
  searchWord,
  setsearchWord
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);

  const onChange = useAsyncDebounce(value => {
    console.log(value, "i m calling value from onchange")
    // setGlobalFilter(value || undefined);
    setsearchWord(value)

  }, 200);


  return (
    <React.Fragment>
      <Col md={4}>
        <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block">
          <div className="position-relative">
            <label htmlFor="search-bar-0" className="search-label">
              <span id="search-bar-0-label" className="sr-only">
                Search this table
              </span>
              <input
                onChange={e => {
                  setValue(e.target.value);
                  onChange(e.target.value);
                }}
                id="search-bar-0"
                type="text"
                className="form-control"
                placeholder={`${count} records...`}
                value={value || ""}
              />
            </label>
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </div>

      </Col>
      {isJobListGlobalFilter && (
        <JobListGlobalFilter />
      )}

    </React.Fragment>
  );
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isJobListGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  setcustomPageSizeValue,
  customPageSizeValue,
  className,
  customPageSizeOptions,
  searchValue,
  pageOptionFromParents,
  pageState,
  setsearchWord,
  searchWord

}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        // pageSize: customPageSizeValue,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = event => {
    setcustomPageSizeValue(Number(event.target.value));
    searchValue(searchWord, customPageSizeValue, 1);
  };

  const onChangeInInput = event => {
    const inputValue = Number(event.target.value, 10);

    if (inputValue >= 1 && inputValue <= pageOptionFromParents?.totalPages) {
      searchValue(searchWord, customPageSizeValue, inputValue);
    }
  };

  console.log(page, "i m calling from page tablecontainer")
  console.log(preGlobalFilteredRows, "i m calling from docs tablecontainer")




  const nextPageMoveDouble = () => {
    searchValue(searchWord, customPageSizeValue, pageOptionFromParents?.totalPages);
  }

  const previousPageMoveDouble = () => {
    searchValue(searchWord, customPageSizeValue, 1);
  }

  const nextPageMove = () => {
    console.log(pageOptionFromParents," i m calling pagggeoptionnnnnnnnnnnnnnnnnnnnnnnnn")
    searchValue(searchWord, customPageSizeValue, pageOptionFromParents?.nextPage);
  }

  const previousPageMove = () => {
    searchValue(searchWord, customPageSizeValue, pageOptionFromParents?.prevPage);
  }


  useEffect(() => {
    if (typeof searchValue === 'function') {
      searchValue(searchWord, customPageSizeValue, pageState);
    }
  }, [searchWord, customPageSizeValue, pageState]);



  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={customPageSizeOptions ? 2 : 1}>
          <select
            className="form-select"
            value={customPageSizeValue}
            onChange={onChangeInSelect}
          >
            {[5, 15, 25, 35, 45].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Col>
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isJobListGlobalFilter={isJobListGlobalFilter}
            setsearchWord={setsearchWord}
            searchWord={searchWord}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>
                    <div className="" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    {/* <Filter column={column} /> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {preGlobalFilteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ fontSize: "2em", color: "red", textAlign: "center" }}>
                  No data found
                </td>
              </tr>

            ) : (
              preGlobalFilteredRows.map(row => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map(cell => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={previousPageMoveDouble}
              disabled={!pageOptionFromParents?.hasPrevPage}
            >
              {"<<"}
            </Button>
            <Button
              color="primary"
              onClick={previousPageMove}
              disabled={!pageOptionFromParents?.hasPrevPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageOptionFromParents?.page} of {pageOptionFromParents?.totalPages}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptionFromParents?.totalPages}
            value={pageOptionFromParents?.page}
            onChange={onChangeInInput}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPageMove} disabled={!pageOptionFromParents?.hasNextPage}>
              {">"}
            </Button>
            <Button
              color="primary"
              onClick={nextPageMoveDouble}
              disabled={!pageOptionFromParents?.hasNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;