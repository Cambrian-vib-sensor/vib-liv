import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DangerousIcon from '@mui/icons-material/Dangerous';
import VibrationDataService from "../services/vibration.service.js";
import { setMessage }  from '../actions/message';
import { connect } from "react-redux";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {  useSearchParams } from "react-router-dom";

//const roles = [{'C': 'Client'}, {'A': 'Admin'}, {'U': 'Cambrian User'}];
const roles = [{'type':'C', 'role': 'Client'}, {'type':'A', 'role': 'Admin'}, {'type':'U', 'role': 'Cambrian User'}];
const passwordHide = "****************";

const User = (props) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rerender, setReRendering] = useState(false);
  const [clients, setClients] = useState([]);
  const txtClientStatus = useRef();

  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    pageIndex:  0,
    pageSize:  10
  });

  useEffect(() => {
    if (searchParams.get('page') && searchParams.get('size')) {
      setPagination({
        pageIndex: searchParams.get('page') ,
        pageSize: searchParams.get('size')
      })
    }
  }, [searchParams])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response =  await VibrationDataService.getactiveclients();
        const json = response.data;
        setClients(json);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableData.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const response =  await VibrationDataService.getusers();
        const json = response.data;
        setTableData(json);
      } catch (error) {
        setIsError(true);
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [rerender]);

  const handleCreateNewRow = () => {
    //tableData.push(values);
    //setTableData([...tableData]);
    //Re-render the page.
    setReRendering(value => !value);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const data = {username: values['username'], 
        password: values['password'] === passwordHide ? row.original.password : values['password'], 
        role: values['role'],
        client_id: values['client.id'],
        status: values['status'] === 'true' ? 'A' : 'D'};
      if (row.original.client.id !== values['client.id'] && values['status'] === 'false') {
        window.alert("User should be active to link to a new client");
        return;
      }
      if (values["client.status"] === 'D' && values['status'] === 'true') {
        window.alert("User cannot be made Active when the client's status is Deleted");
        return;
      }
      VibrationDataService.updateuser(values.id, data).then(response => {
        setReRendering(value => !value);
        exitEditingMode();
      }).catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          //dispatch error message to show the message in message/alert area
          console.log(error.response.data.message);
          props.dispatch(setMessage(error.response.data.message));
        }
      });
      //tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      //setTableData([...tableData]);
      //exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.getValue('username')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
      VibrationDataService.deleteuser(row.getValue('id')).then(response => {
        props.dispatch(setMessage(response.data.message));
        setReRendering(value => !value);
      }).catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          props.dispatch(setMessage(error.response.data.message));
        }
      });
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = 
              cell.column.id === 'username'
              ? validateEmail(event.target.value)
              : cell.column.id === 'password'
              ? validatePassword(event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            const errorMsg = 
              cell.column.id === 'username'
              ? `${cell.column.columnDef.header} is required and should be a valid email id`
              : cell.column.id === 'password'
              ? `${cell.column.columnDef.header} is required and should be 8 characters long`
              :`${cell.column.columnDef.header} is required`;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: errorMsg,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'username',
        header: 'User Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'password',
        header: 'Password',
        accessorFn: (row) => passwordHide,
        size: 140,
        /*Cell: ({ cell }) => (
            <>
            {passwordHide}
            </>
        ),*/
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'status',
        header: 'User Status',
        enableColumnOrdering: false,
        //enableEditing: false, //disable editing on this column
        enableSorting: false,
        accessorFn: (row) => (row.status === 'A' ? 'true' : 'false'), //must be strings
        filterVariant: 'checkbox',
        Cell: ({cell}) => (
            <>{cell.getValue() === 'true' ? <VerifiedUserIcon color='primary'/> : <DangerousIcon color='error'/>}</>
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            select: true, 
            children:
              [<MenuItem key={'A'} value={'true'}>
                {'Active'}
              </MenuItem>, <MenuItem key={'D'} value={'false'}>
                {'Deleted'}
              </MenuItem>],
        }),
      },
      {
        accessorKey: 'client.id',
        Cell: ({cell}) => (<>{cell.row.original.client.name}</>),
        header: 'Client',
        size: 140,
        //Edit: ({ cell, column, row, table }) => <ClientsList column={column} row={row}/>,
        muiTableBodyCellEditTextFieldProps: (cell, row) => { return {
          select: true, 
          children: clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          )),
          onChange: (e) => {
            let selectedClient = clients.find((client) => client.id === e.target.value);
            txtClientStatus.current = selectedClient.status;
          },
        }},
      },
      {
        accessorKey: 'client.status',
        header: 'Client Status',
        size: 140,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        accessorFn: (row) => {
          return (row.client.status === 'A' ? 'true' : 'false')}, //must be strings
        filterVariant: 'checkbox',
        Cell: ({cell}) => (
            <>{cell.getValue() === 'true' ? <VerifiedUserIcon color='primary'/> : <DangerousIcon color='error'/>}</>
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            value: txtClientStatus.current,
            ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        /*muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),*/
        Cell: ({ cell }) => (
            <>
            {cell.getValue() === 'A' ? 'Admin' : (cell.getValue() === 'U' ? 'Cambrian' : 'Client')}
            </>
        ),
        muiTableBodyCellEditTextFieldProps: {
            select: true, 
            children: roles.map((role) => (
              <MenuItem key={role.type} value={role.type}>
                {role.role}
              </MenuItem>
            )),
          },
      },
    ],
    [getCommonEditTextFieldProps, clients],
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };
  
  const csvExporter = new ExportToCsv(csvOptions);
  
  const handleExportRows = (rows) => {
    csvExporter._options.filename = "Users";
    csvExporter._options.title = "Users";
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter._options.filename = "Users";
    csvExporter._options.title = "Users";
    csvExporter.generateCsv(tableData);
  };
  
  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        initialState={{ showColumnFilters: true, density: 'compact' }}
        state={{
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            pagination: pagination
        }}
        columns={columns}
        data={tableData}
        editingMode= "modal"
        enableRowSelection
        enableColumnOrdering
        enableEditing
        muiTablePaginationProps={{
          page: Number(pagination.pageIndex),
          onPageChange:(_, page) => {
            if (page < 0) return;
            setPagination((prev) => {
              setSearchParams({
                page: page,
                size: prev.pageSize,
              })
              return ({
                ...prev,
                pageIndex: page
              })
            })
          
          },
          onRowsPerPageChange: (event) => {
            setPagination((prev) => {
              setSearchParams({
                size: event.target.value,
                page: prev.pageIndex,
              })
              return ({
                ...prev,
                pageSize: event.target.value,
              })
            })
          
          }
        }}
        //enableDensityToggle={false}
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => {txtClientStatus.current = row.original.client.status; table.setEditingRow(row)}}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({table}) => (
          <Box
            sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
          >
            <Button
              color="secondary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Create New User
            </Button>
            {/*<Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>*/}
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              //export all rows, including from the next page, (still respects filtering and sorting)
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Rows
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
              onClick={() => handleExportRows(table.getRowModel().rows)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Page Rows
            </Button>
            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Selected Rows
            </Button>
          </Box>
        )}
      />
      <CreateNewModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        clients={clients}
        dispatch={props.dispatch}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewModal = ({ open, columns, onClose, onSubmit, clients, dispatch }) => {
  const setInitialValues = () => columns.reduce((acc, column) => {
    switch (column.accessorKey) {
      case 'status':
        acc[column.accessorKey] = 'A';
        break;
      case 'role':
        acc[column.accessorKey] = 'C';
        break;
      default:
        acc[column.accessorKey ?? ''] = '';
    }
    return acc;
  }, {});

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required and must be a valid email id')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    client_id: Yup.number()
      .required('Client name is required')
      .typeError('Client name is required')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [values, setValues] = useState(setInitialValues);

  const modalSubmit = () => {
    //put your validation logic here
    const data = {username: values['username'], 
                  password: values['password'], 
                  role: values['role'],
                  client_id: values['client_id'],
                  status: values['status']};
    VibrationDataService.createuser(data).then(response => {
      setValues(setInitialValues);
      onSubmit();
      onClose();
    }).catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        dispatch(setMessage(error.response.data.message));
      }
    });
    //onSubmit(values);
    //onClose(); 
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New User</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "client.id") {
                {/*<ClientsList setValues={setValues} values={values} column={column}/>*/}
                return (
                  <FormControl fullWidth>
                    <InputLabel id="allClients">{column.header}</InputLabel>
                    <Select
                      key={'client_id'} {...register('client_id')} error={errors['client_id'] ? true : false} labelId="allClients" label={column.header} name={'client_id'}
                      onChange={(e) =>
                        {
                          let selectedClient = clients.find((client) => client.id === e.target.value);
                          setValues({ ...values, [e.target.name]: e.target.value, ['client.status']: selectedClient.status });
                        }}
                    >
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
                      ))}
                    </Select>
                    <Typography variant="inherit" color="error">
                      {errors['client_id']?.message}
                    </Typography>
                  </FormControl>
                )
              } else if (column.accessorKey === "status") {
                return (
                    <FormControl fullWidth>
                    <InputLabel id="role-select-label">{column.header}</InputLabel>
                    <Select key={column.accessorKey} labelId="role-select-label" label={column.header} name={column.accessorKey} value = {values[column.accessorKey]} disabled="true"
                        onChange={(e) =>
                            setValues({ ...values, [e.target.name]: e.target.value })}>
                        <MenuItem key='A' value='A'>
                            {'Active'}
                        </MenuItem>
                        <MenuItem key='D' value='D'>
                            {'Deleted'}
                        </MenuItem>
                    </Select>
                    </FormControl>
                )
              } else if (column.accessorKey === "role") {
                return (
                    <FormControl fullWidth>
                    <InputLabel id="role-select-label">{column.header}</InputLabel>
                    <Select key={column.accessorKey} labelId="role-select-label" label={column.header} name={column.accessorKey} value = {values[column.accessorKey]}
                        onChange={(e) =>
                            setValues({ ...values, [e.target.name]: e.target.value })}>
                    {roles.map((role) => 
                        (<MenuItem key={role.type} value={role.type}>
                            {role.role}
                        </MenuItem>))
                    }
                    </Select>
                    </FormControl>)
              } else {
              return (
              <>
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                {...register(column.accessorKey)}
                error={errors[column.accessorKey] ? true : false}
                disabled={(column.accessorKey === "id" || column.accessorKey === "client.status")  ? true : false}
                value = {values[column.accessorKey]}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              <Typography variant="inherit" color="error">
                {errors[column.accessorKey]?.message}
              </Typography>
              </>
            )}})}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit(modalSubmit)} variant="contained">
          Create New User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;

const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

const validatePassword = (password) => password.length >= 8;

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(User);
