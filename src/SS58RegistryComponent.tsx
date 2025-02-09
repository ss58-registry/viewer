import React, { useEffect, useMemo, useState } from "react";
import ss58Registry from "@substrate/ss58-registry";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export interface RegistryEntry {
  decimals: number[];
  displayName: string;
  network: string;
  prefix: number;
  standardAccount: "*25519" | "Ed25519" | "Sr25519" | "secp256k1" | null;
  symbols: string[];
  website: string | null;
}

const SS58RegistryComponent: React.FC = () => {
  const data = useMemo<RegistryEntry[]>(() => ss58Registry, []);
  const [filterInput, setFilterInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const columns = useMemo<Column<RegistryEntry>[]>(
    () => [
      {
        Header: "Prefix",
        accessor: "prefix",
      },
      {
        Header: "Network",
        accessor: "network",
      },
      {
        Header: "Display Name",
        accessor: "displayName",
      },
      {
        Header: "Symbols",
        accessor: "symbols",
        Cell: ({ value }: { value: string[] }) => value?.join(", ") || "N/A",
      },
      {
        Header: "Decimals",
        accessor: "decimals",
        Cell: ({ value }: { value: number[] }) => value?.join(", ") || "N/A",
      },
      {
        Header: "Standard Account",
        accessor: "standardAccount",
        Cell: ({ value }: { value: string | null }) => value || "N/A",
      },
      {
        Header: "Website",
        accessor: "website",
        Cell: ({ value }: { value: string | null }) =>
          value
            ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {value}
              </a>
            )
            : (
              "N/A"
            ),
      },
    ],
    [],
  );

  const tableInstance = useTable<RegistryEntry>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50 } as any, // Type assertion to avoid error
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance as any; // Type assertion to avoid errors

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setGlobalFilter(value);
    setFilterInput(value);
  };

  return (
    <div className="p-4 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          SS58 Registry Viewer
        </h1>
        <div className="flex items-center">
          <a
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ margin: "0 10px" }}
            className="text-gray-800 dark:text-white"
          >
            <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} size="2x" />
          </a>
          <a
            href="https://x.com/btwiuse"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px", display: "none" }}
            className="text-gray-800 dark:text-white"
          >
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </a>
          <a
            href="https://github.com/ss58-registry/viewer"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px" }}
            className="text-gray-800 dark:text-white"
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
        </div>
      </div>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Search in all columns..."
        className="p-2 mb-4 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        >
          <thead>
            {headerGroups.map((headerGroup: any) => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps();
              <tr key={key} {...rest}>
                {headerGroup.headers.map((column: any) => {
                  const { key, ...rest } = column.getHeaderProps(
                    column.getSortByToggleProps(),
                  );
                  return (
                    <th
                      key={key}
                      {...rest}
                      className="p-2 bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600 text-left dark:text-white"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc ? " 🔽" : " 🔼"
                          : ""}
                      </span>
                    </th>
                  );
                })}
              </tr>;
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: any) => {
              prepareRow(row);
              const { key, ...rest } = row.getRowProps();
              return (
                <tr
                  key={key}
                  {...rest}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {row.cells.map((cell: any) => {
                    const { key, ...rest } = cell.getCellProps();
                    return (
                      <td
                        key={key}
                        {...rest}
                        className="p-2 dark:text-gray-300"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center dark:text-white">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="mr-2 px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="mr-2 px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="mr-2 px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
          {" "}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {[50, 100, 200].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SS58RegistryComponent;
