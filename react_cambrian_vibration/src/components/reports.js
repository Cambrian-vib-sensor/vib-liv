import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VibrationDataService from "../services/vibration.service.js";
import { setMessage } from '../actions/message';
import Reportview from './reportview.js';
import { Select, MenuItem, FormControl, InputLabel, ListItemIcon, Checkbox, ListItemText, OutlinedInput, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MenuProps, useStyles, options } from "./utils";
import { PDFDownloadLink } from '@react-pdf/renderer';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import moment from "moment";

import html2pdf from 'html2pdf.js';


const Reports = (props) => {
 const classes = useStyles();
  
 const loaderdiv = {
  display: 'flex',
  justifyContent: 'center',
  };

  const loader = {
  margin: 'auto 0',
    
  };

  const tableStyle = {
    bordercollapse: 'collapse',
    width: '100%',

  };
  const thStyle = {

    textAlign: "center", border: '1px solid black',

  };
  const trStyle = {
    backgroundColor: '#eee',
    padding: '5px',
    textAlign: 'center',
    pageBreakInside: 'avoid !important',

  };

  const tdStyle = {
    border: '1px solid black',
    padding: '5px',
    width: '10%',
    textAlign: 'center',
    pageBreakInside: 'avoid',

  };

  const [clients, setClients] = useState([]);
  const [client_id, setClient_id] = useState(null);
  const [clientLoctions, setClientLocations] = useState([]);
  const dateRange = [];
  const [sensors, setsensorslist] = useState([]);
  const [selectedLocations, setLocationSelected] = useState([]);
  const [selectedLocationsids, setLocationSelectedids] = useState([]);
  const isAllLocationSelected = clientLoctions.length > 0 && selectedLocations.length === clientLoctions.length;
  const [selectedSensors, setsensorSelected] = useState([]);
  const isAllsensorSelected = sensors.length > 0 && selectedSensors.length === sensors.length;
  const [newlocationvalues, setLocationValues] = useState([]);
  const [newsensorvalues, setSenorValues] = useState([]);
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [sensorids, setsensoreids] = useState([]);
  const [responsedata, setreportdata] = useState([]);
  const [reportdata, setsensorsdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newfromdate, setfromdate] = useState('');
  const [newtodate, settodate] = useState('');

  useEffect(() => { getSensors(newlocationvalues) }, [newlocationvalues]);
  useEffect(() => { getsensorids(newsensorvalues) }, [newsensorvalues]);

  const handleLocationChange = (event) => {
    setsensorSelected([]);
    setSenorValues([]);
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setLocationSelectedids(clientLoctions.map((option) => option.id));
      let selectAllLocations = clientLoctions.map((option) => option.name);
      setLocationSelected(selectedLocations.length === clientLoctions.length ? [] : selectAllLocations);
      getSensors(selectedLocationsids);
      return;
    } else {
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
  // Pdf Download 
  const handleDownload = () => {
    const input = document.getElementById("pdf-download");
    html2pdf().from(input).set({
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      filename: "my-document.pdf",
      margin: [0.5, 0.5],
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      onAfterPageContent: (currentPage, totalPages) => {
        const footer = document.createElement("div");
        footer.style.fontSize = "10pt";
        footer.style.textAlign = "center";
        footer.innerHTML = `Page ${currentPage} of ${totalPages}`;
        return footer;
      }
    }).save();
  };
  /*** Onchange of sensors dropdown **/
  const handleSensorChange = (event) => {
    const sensorvalue = event.target.value;
    if (sensorvalue[sensorvalue.length - 1] === "all") {
      //setSenorValues(sensors.map((option) => option.id));
      setSenorValues(sensors.map((option) => option.sensor_id));
      let selectAllSensors = sensors.map((option) => option.sensor_id);
      setsensorSelected(selectedSensors.length === sensors.length ? [] : selectAllSensors);
      getsensorids(newlocationvalues);
      return;
    }
    const getSensorsIds = (sensors, sensorvalue) => {
      const filtered = sensors.filter(obj => sensorvalue.includes(obj.sensor_id));
      // const results = filtered.map(obj => obj.id);
      const results = filtered.map(obj => obj.sensor_id);
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

  //Create an array of dates between the start and end dates
  const dateArray = [];
  const headerItem = "name";
  let currentDate = new Date(fromdate);
  let enddate = new Date(todate);
  while (currentDate <= new Date(enddate)) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const tableRows = dateArray.map(date => {
    const formattedDate = date.toISOString().substring(0, 10);

    return (
      <tr key={formattedDate}>
        <td>{formattedDate}</td>
      </tr>
    );
  });

  const arraydata = Object.values(tableRows);
  console.log("array", arraydata);
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
    setLoading(false);
    event.preventDefault();
    let dateRows = [];
    const reportsensorids = sensorids;
    const reportfromdate = fromdate;
    const reporttodate = todate;

    setfromdate(moment(fromdate).format("DD-MMM-YYYY"));
    settodate(moment(todate).format("DD-MMM-YYYY"));

    const data = { reportsensorids, reportfromdate, reporttodate }

    const fetchSensordata = async () => {
      setLoading(true);
      try {
        const response = await VibrationDataService.getreportdata(data);
        const json = response.data;
        setreportdata(json);
        const groupedObject = json.reduce((acc, obj) => {
          const key = obj.name;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});

        setsensorsdata(groupedObject);
        setLoading(false);
      } catch (error) {
        if (error.responsenew && error.response.data && error.response.data.message) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
    };
    fetchSensordata();
  }

  useEffect(() => {
  }, [reportsubmit]);

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
                    <ListItemText value={option.id} primary={option.name} />
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
                    <ListItemText primary={option.sensor_id} />
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
              format={'YYYY-MM-DD'}
              sx={{ width: 150 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setFromdate(event.target.value)
              }
              required
            />
          </Col>
          <Col>
            <TextField
              name="todate"
              label="Untill:"
              type="date"
              format={'YYYY-MM-DD'}
              sx={{ width: 150 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setTodate(event.target.value)
              }
              required
            />
          </Col>
          <Col>
            <button type="submit" id="search" class="btn btn-secondary">Search</button>
          </Col>
        </Row>
      </form>

      <div style={{ float: "right", marginBottom: '50px' }}>

        {/* {reportdata.length === 0 ? (<></>) : (
   
      < PDFDownloadLink document={<Reportview reportdataValues={ [reportdataValues , dateArray] } />} fileName="Vibrationsensor" >
       {({ loading }) => loading ? (<Button variant="contained" endIcon={<FileDownloadIcon />}>Loading Document...</Button>) : (<Button variant="contained" endIcon={<FileDownloadIcon />}>Download</Button>)}
      </PDFDownloadLink>            
      )} */}

        {<PDFDownloadLink document={<Reportview newfromdate={newfromdate} newtodate={newtodate} headerItem="name" reportdata={reportdata} client_id={client_id} dateArray={dateArray} />} fileName="Vibrationsensor" >
          {({ loading }) => loading ? (<Button variant="contained" endIcon={<FileDownloadIcon />}>Loading Document...</Button>) : (<Button variant="contained" endIcon={<FileDownloadIcon />}>Download</Button>)}
        </PDFDownloadLink>}
        <button onClick={handleDownload}>Download PDF</button>
      </div>

      {loading == false ? <></> : <div style={loaderdiv}>
        <img src="../../loader.gif" alt="Loading..." style={loader} />
        </div>
        }


      {reportdata.length === 0 || Object.values(reportdata).length === 0 ? (
        <table style={tableStyle}>
          <tr style={trStyle}>
            <th style={thStyle}>Report Results</th>
          </tr>
          <tr style={tdStyle}>
            <td style={tdStyle}>No Records Found</td>
          </tr>
        </table>
      ) : (
        <div id="pdf-download">
          {client_id == 10 ? (
            <table style={tableStyle}>
              <tr style={trStyle}>
                <th style={thStyle}>No</th>
                <th style={thStyle}>VM name</th>
                <th style={thStyle}>Sensor ID</th>
                <th style={thStyle}>Locations</th>
                <th style={thStyle}>Vibration limits criteria (10 Hz)</th>
                <th style={thStyle}>Vibration limits criteria (80 Hz)</th>
                <th style={thStyle}>Proposed alarm level</th>
              </tr>
              {Object.values(reportdata).map((arr, index) =>
                <tr style={tdStyle}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}> {Array.from(new Set(arr.map((item) => item[headerItem])))}</td>
                  <td style={tdStyle}> {Array.from(new Set(arr.map((item) => item.sensor_id)))}</td>
                  <td style={tdStyle}>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</td>
                  <td style={tdStyle}>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</td>
                  <td style={tdStyle}>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</td>
                  <td style={tdStyle}>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</td>
                </tr>
              )}
            </table>) : (<></>)}
          {Object.values(reportdata).map((arr) =>
            <table style={tableStyle}>
              <thead><br></br>
                <tr style={{ textAlign: "center", border: '1px solid black' }}>
                  <td style={tdStyle}>Period</td>
                  <td style={tdStyle}>{newfromdate} - {newtodate}</td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td style={tdStyle}>Location </td>
                  <td style={tdStyle}> {Array.from(new Set(arr.map((item) => item[headerItem])))}</td>
                </tr>
                <tr style={{ textAlign: "center", border: '1px solid black' }}>
                  <td style={tdStyle}> Limits from table 1   </td>
                  <td style={tdStyle}>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</td>
                </tr>
                <tr style={{ textAlign: "center"}}>
                  <td style={tdStyle}>Activities within the area of the vibration meter</td>
                  <td style={tdStyle}>- Footsteps of people walking near the common area
                    - Operation of hospital equipment and machines.
                    - Printer on the opposite side operates periodically
                    - Trays and carts are being pushed near the common area</td>
                </tr><br></br>
              </thead>
              <table style={tableStyle}>
                <thead>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Remarks</th>
                </thead>
                <tbody>
                  {dateArray.map(date => {
                    const filteredArr = arr.filter(item => new Date(item.received_at).toISOString().substring(0, 10) === date.toISOString().substring(0, 10));
                    const exceedsLimit = filteredArr.some(item => item.sensor_value > item.vibration_max_limit);
                    return (
                      <tr style={{ pageBreakInside: 'avoid' }} key={date.toISOString().substring(0, 10)}>
                        <td style={tdStyle}>{date.toISOString().substring(0, 10)}</td>
                        <td style={tdStyle}>
                          {exceedsLimit
                            ? filteredArr.map(item => (
                              <div key={item.sensor_value}>
                                {item.sensor_value > item.vibration_max_limit && (
                                  <p>
                                    Exceeding {item.vibration_max_limit} with {item.sensor_value} mm/s between 1 Hz – 80 Hz at {item.received_at}
                                  </p>
                                )}
                              </div>
                            ))
                            : (<p>
                              Not exceeding {Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s between 1 Hz – 80 Hz
                            </p>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              <div className="page-break"></div>
            </table>
          )
          }

        </div>

      )}
    </div>

  )
}

export default Reports;