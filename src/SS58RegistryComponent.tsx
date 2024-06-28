import React, { useMemo, useState, useEffect } from 'react';
import ss58Registry from '@substrate/ss58-registry';
import { useTable, useGlobalFilter, useSortBy, usePagination, Column } from 'react-table';

export interface RegistryEntry {
	decimals: number[],
	displayName: string;
	network: string;
	prefix: number;
	standardAccount: '*25519' | 'Ed25519' | 'Sr25519' | 'secp256k1' | null;
	symbols: string[];
	website: string | null;
}

const SS58RegistryComponent: React.FC = () => {
  const data = useMemo<RegistryEntry[]>(() => ss58Registry, []);
  const [filterInput, setFilterInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const columns = useMemo<Column<RegistryEntry>[]>(
    () => [
      {
        Header: 'Prefix',
        accessor: 'prefix',
      },
      {
        Header: 'Network',
        accessor: 'network',
      },
      {
        Header: 'Display Name',
        accessor: 'displayName',
      },
      {
        Header: 'Symbols',
        accessor: 'symbols',
        Cell: ({ value }: { value: string[] | undefined }) => value?.join(', ') || 'N/A',
      },
      {
        Header: 'Decimals',
        accessor: 'decimals',
        Cell: ({ value }: { value: number[] | undefined }) => value?.join(', ') || 'N/A',
      },
      {
        Header: 'Standard Account',
        accessor: 'standardAccount',
        Cell: ({ value }: { value: string | undefined }) => value || 'N/A',
      },
      {
        Header: 'Website',
        accessor: 'website',
        Cell: ({ value }: { value: string | undefined }) => 
          value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {value}
            </a>
          ) : (
            'N/A'
          ),
      },
    ],
    []
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
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setGlobalFilter(value);
    setFilterInput(value);
  };

  return (
    <div className="p-4 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">SS58 Registry</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
        >
          {isDarkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Search in all columns..."
        className="p-2 mb-4 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-2 bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600 text-left dark:text-white"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="p-2 dark:text-gray-300">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center dark:text-white">
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mr-2 px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50">
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50">
            {'<'}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2 px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50">
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-2 py-1 border rounded dark:border-gray-600 disabled:opacity-50">
            {'>>'}
          </button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
          className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {[50, 100, 200].map(pageSize => (
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