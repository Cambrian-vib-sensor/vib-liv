import DataTable from './DataTableBase';
import NoDataComponent from './nodatacomponent';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import * as React from 'react';
import CsvDownloader from 'react-csv-downloader';

const TitleComponent = ({label}) => <h2>{label}</h2>;
const CellComponent = ({label}) => <div style={{backgroundColor:'red', color:'white'}} data-tag="allowRowEvents">{label}</div>;
const Downloader = (props) => {return (<div>
      <CsvDownloader
        filename="myfile"
        extension=".csv"
        separator=";"
        wrapColumnChar="'"
        columns={props.columns}
        datas={props.datas}
        text="DOWNLOAD" />
    </div>)};
const columns = [
    {
        name: <TitleComponent label='Title'/>,
        selector: (row, index) => {console.log(row); console.log(index); return row.title},
        sortable: true,
        cell: (row, index, column, id) => <CellComponent label={row.title} />,
        reorder: true
    },
    {
        name: 'Year',
        selector: row => row.year,
        sortable: true
    },
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;
const rowClicked = (row, event) => {
  console.log(row);
  console.log(event);
}

const LinearIndeterminate = () => {
  return (
    <div style={{padding:'5px'}}>
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    </div>
  );
}

function Client() {
    /*const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = data.filter(
      item => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()),
    );
  
    const subHeaderComponentMemo = React.useMemo(() => {
      const handleClear = () => {
        if (filterText) {
          setResetPaginationToggle(!resetPaginationToggle);
          setFilterText('');
        }
      };
  
      return (
        <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      );
    }, [filterText, resetPaginationToggle]);
  
    return (
      <DataTable
        title="Contact List"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        persistTableHead
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    );*/
    const actionsMemo = React.useMemo(() => <Downloader columns={columns} datas={data} />, []);
    return <><NoDataComponent/><LinearIndeterminate/><DataTable columns={columns} data={data} selectableRows expandableRows
    expandableRowsComponent={ExpandedComponent} subHeader 
    noDataComponent={NoDataComponent} 
    onRowClicked={rowClicked}
    //sortIcon={IconBxsDownArrowSquare}
    progressComponent={LinearIndeterminate}
    //progressPending={true}
    actions={actionsMemo}
    /></>;
  };


    /*return (
        <DataTable
            columns={columns}
            data={data}
            pagination
		        selectableRows
		        dense
        />
    );*/

export default Client;