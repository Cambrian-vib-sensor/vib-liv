import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VibrationDataService from "../services/vibration.service.js";
import { setMessage } from '../actions/message';
import Reportview from './reportview.js';
import { Select, MenuItem, FormControl, InputLabel, ListItemIcon, Checkbox, ListItemText, OutlinedInput ,Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MenuProps, useStyles, options } from "./utils";
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'axios';
import { border, borderBottom, borderLeft } from '@mui/system';
import { BorderStyleRounded, CenterFocusStrong } from '@mui/icons-material';
const Reports = (props) => {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const [client_id, setClient_id] = useState(null);
  const [clientLoctions, setClientLocations] = useState([]);
  // const [location_id, setSensors] = useState(null);
  const [sensors, setsensorslist] = useState([]);
  const [selectedLocations, setLocationSelected] = useState([]);
  const [selectedLocationsids, setLocationSelectedids] = useState([]);
  // const [selectedsensorids, setSensorSelectedids] = useState([]);
  const isAllLocationSelected = clientLoctions.length > 0 && selectedLocations.length === clientLoctions.length;
  const [selectedSensors, setsensorSelected] = useState([]);
  const isAllsensorSelected = sensors.length > 0 && selectedSensors.length === sensors.length;
  const [newlocationvalues, setLocationValues] = useState([]);
  const [newsensorvalues, setSenorValues] = useState([]);
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [sensorids, setsensoreids] = useState([]);
  const [reportdata, setsensorsdata] = useState([]);

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    margin: 'auto',
    border: '2px solid black',
    margin:'5px',
    
  };

  const thStyle = {
    backgroundColor: '#eee',
    padding: '10px',
    textAlign: 'left',
  };

  const tdStyle = {
    border: '1px solid black',
    padding: '10px',
    textAlign: 'left',
  };

   useEffect(() => { getSensors(newlocationvalues)}, [newlocationvalues]);
   useEffect(() => { getsensorids(newsensorvalues)}, [newsensorvalues]);

    const handleLocationChange = (event) => {
    setsensorSelected([]);
    setSenorValues([]);
    const value = event.target.value;
    if(value[value.length - 1] === "all") {
      setLocationSelectedids(clientLoctions.map((option) => option.id));
      let selectAllLocations=clientLoctions.map((option) => option.name);
      setLocationSelected(selectedLocations.length === clientLoctions.length ? [] : selectAllLocations);
      getSensors(selectedLocationsids);
      return;
    }else{     
    const getLocationIds = (clientLoctions, value) => {
    const filtered = clientLoctions.filter(obj => value.includes(obj.name));
    const result = filtered.map(obj => obj.id);
    setLocationValues(result);
     }
     getLocationIds(clientLoctions, value);
     setLocationSelected(value); 
     getSensors(value);

    }
  };

  /*** Onchange of sensors dropdown **/
  const handleSensorChange = (event) => {
    const sensorvalue = event.target.value;
    if (sensorvalue[sensorvalue.length - 1] === "all") {
    setSenorValues(sensors.map((option) => option.id));
    let selectAllSensors = sensors.map((option) => option.sensor_id);
    setsensorSelected(selectedSensors.length === sensors.length ? [] : selectAllSensors);
    getsensorids(newlocationvalues);
    return;

    }
    const getSensorsIds = (sensors, sensorvalue) => {
    const filtered = sensors.filter(obj => sensorvalue.includes(obj.sensor_id));
    const results = filtered.map(obj => obj.id);
    setSenorValues(results);
    }
    getSensorsIds(sensors, sensorvalue);
    setsensorSelected(sensorvalue);
    getsensorids(newlocationvalues);
  };

  /***Getting client dropdown***/
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await VibrationDataService.getactiveclients();
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

/* Onchange of client get locations of the clients */
  useEffect(() => { getLocation(client_id) }, [client_id]);
  const clientid = (e) => {
    setClient_id(e.target.value);
    setsensorSelected([]);
    setSenorValues([]);
  };

  useEffect(() => { getSensors(selectedLocationsids) }, [selectedLocationsids]);

  const getLocation = (client_id) => {
    setLocationSelected([]);
      if (client_id == "empty") {
      alert("Please select Client valid client...")
    } else {
      const fetchLocations = async () => {
        try {
          const response = await VibrationDataService.getLocationOfClient(client_id);
          const json = response.data;
          setClientLocations(json);
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            props.dispatch(setMessage(error.response.data.message));
          }
          return;
        }
      };
      fetchLocations();
    }
  };

  const getsensorids = (selectedsensorids) => {
    setsensoreids(selectedsensorids);
   }

  const getSensors = (selectedLocationsids) => {
      const fetchSensors = async () => {
        try {
          const response = await VibrationDataService.getSensorsByLocation(selectedLocationsids);
          const json = response.data;
          setsensorslist(json);
            } catch (error) {
          if (error.responsenew && error.response.data && error.response.data.message) {
            props.dispatch(setMessage(error.response.data.message));
          }
          return;
        }
      };

      fetchSensors();
    
  };

  const reportsubmit = (event) => {
    event.preventDefault();
    
    const reportsensorids= sensorids;
    const reportfromdate=fromdate;
    const reporttodate=todate;

    const data= {reportsensorids,reportfromdate,reporttodate}

    const fetchSensordata = async () => {
      try {
        const response = await VibrationDataService.getreportdata(data);
        const json = response.data;
        setsensorsdata(json);
          } catch (error) {
        if (error.responsenew && error.response.data && error.response.data.message) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
    };    
    fetchSensordata();
 }


  return (
    <div>
      <form onSubmit={reportsubmit}>
        <Row>
          <Col>
            <FormControl sx={{ m: 1, minWidth: 40 }}>
              <InputLabel id="demo-simple-select-autowidth-label">Client</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                onChange={clientid}
                required 
                 sx={{ width: 150 }}
                label="Client"
              >
                <MenuItem value="empty">Select Client</MenuItem>
                {clients.map((options) => {
                  return <MenuItem key={options.id} value={options.id}>{options.name}</MenuItem>
                })}
              </Select>
            </FormControl>


          </Col>
          <Col>
            <FormControl sx={{ m: 1, minWidth: 40 }}>
              <InputLabel id="demo-simple-select-autowidth-label">Location</InputLabel>
              <Select
                sx={{ width: 150 }}
                label="Location"
                labelId="mutiple-select-label"
                multiple
                required 
                variant="outlined"
                value={selectedLocations}
                onChange={handleLocationChange}
                renderValue={(selectedLocations) => selectedLocations.join(", ")}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="all"
                  classes={{
                    root: isAllLocationSelected ? classes.selectedAll : ""
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      classes={{ indeterminate: classes.indeterminateColor }}
                      checked={isAllLocationSelected}
                      indeterminate={
                        selectedLocations.length > 0 && selectedLocations.length < clientLoctions.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.selectAllText }}
                    primary="Select All"
                  />
                </MenuItem>
                {clientLoctions.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    <ListItemIcon>
                      <Checkbox value={option.id} checked={selectedLocations.indexOf(option.name) > -1} />
                    </ListItemIcon>
                    <ListItemText value={option.id} primary={option.name}  />
                  </MenuItem>
                ))}

              </Select>
            </FormControl>

          </Col>

          <Col>


            <FormControl sx={{ m: 1, minWidth: 40 }}>
              <InputLabel id="demo-simple-select-autowidth-label">sensors</InputLabel>

              <Select

                sx={{ width: 150 }}
                label="Location"
                labelId="mutiple-select-label"
                multiple
                required 
                variant="outlined"
                value={selectedSensors}
                onChange={handleSensorChange}
                renderValue={(selectedSensors) => selectedSensors.join(", ")}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="all"
                  classes={{
                    root: isAllsensorSelected ? classes.selectedAll : ""
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      classes={{ indeterminate: classes.indeterminateColor }}
                      checked={isAllsensorSelected}
                      indeterminate={
                        selectedSensors.length > 0 && selectedSensors.length < sensors.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.selectAllText }}
                    primary="Select All"
                  />
                </MenuItem>
                {sensors.map((option, index) => (
                  <MenuItem key={option.sensor_id} value={option.sensor_id}>
                    <ListItemIcon>
                      <Checkbox value={option.id} checked={selectedSensors.indexOf(option.sensor_id) > -1} />
                    </ListItemIcon>
                    <ListItemText primary={option.sensor_id}  />
                  </MenuItem>
                ))}

              </Select>
            </FormControl>
          </Col>
          <Col>
            <TextField
              name="fromdate"
              label="From:"
              type="date"
              defaultValue="2017-05-24"
              required 
              sx={{ width: 150 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setFromdate(event.target.value)
              }
            />

          </Col>

          <Col>
            <TextField
              name="todate"
              label="Untill:"
              type="date"
              required 
              defaultValue="2017-05-24"
              sx={{ width: 150 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setTodate(event.target.value)
              }            
              />
          </Col>

          <Col>
            <button type="submit" id="search" class="btn btn-secondary">Search</button>
          </Col>
          
        </Row>
      </form>
  <div style={{float:"right",marginBottom:'5px'}}>
      {reportdata.length === 0 ? (<></>) : (
      <PDFDownloadLink document={<Reportview  data= {reportdata} />} fileName="Vibrationsensor" >
       {({ loading }) => loading ? (<Button variant="contained" endIcon={<FileDownloadIcon />}>Loading Document...</Button>) : (<Button variant="contained" endIcon={<FileDownloadIcon />}>Download</Button>)}
      </PDFDownloadLink>            
      )}
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>sensor_id</th>
            <th style={thStyle}>value</th>
            <th style={thStyle}>Received_at</th>
          </tr>
        </thead>
        <tbody>
        {reportdata.length === 0 ? (
            <tr>
              <td colSpan="3" style={{textAlign:"center",border:'1px solid black'}}>No records found</td>
            </tr>
          ) : (
            reportdata.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.sensor_id}</td>
                <td style={tdStyle}>{item.sensor_value}</td>
                <td style={tdStyle}>{item.received_at}</td>
              </tr>
            ))
          )}        
        </tbody>
      </table>
    </div>

  );
}

export default Reports;