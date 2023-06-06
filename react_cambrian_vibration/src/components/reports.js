import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VibrationDataService from "../services/vibration.service.js";
import { setMessage } from '../actions/message';
import Reportview from './reportview.js';
import { Select, MenuItem, FormControl, InputLabel, ListItemIcon, Checkbox, ListItemText, OutlinedInput, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MenuProps, useStyles, options, formatReportDataToTable } from "./utils";
import { PDFDownloadLink } from '@react-pdf/renderer';
import SearchList from './searchbox.js';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import moment from "moment";
import html2pdf from 'html2pdf.js';
import './Report.css';
import Searchbox from './searchbox.js';


const MINUTES_DATA = [
  '0',
  '5',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '50',
  '55',
]

const Reports = (props) => {
  const classes = useStyles();

  const loaderdiv = {
    display: 'flex',
    justifyContent: 'center',
  };

  const loader = {
    margin: 'auto 0',

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

  // var formattedData = {};
  // var format = {};
  // var dates = getDatesInRange(fromdate,todate);
  // var today = new Date();

  const INTERVALS_PER_HOUR = 12; // 60 minutes / 5 minutes = 12 intervals per hour
  const HOURS_PER_DAY = 24;
  const AM_PM_LABELS = ['AM', 'PM'];

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
  // const headerItem = "name";
  // let currentDate = new Date(fromdate);
  // let enddate = new Date(todate);
  // while (currentDate <= new Date(enddate)) {
  //   dateArray.push(new Date(currentDate));
  //   currentDate.setDate(currentDate.getDate() + 1);
  // }
  // const tableRows = dateArray.map(date => {
  //   const formattedDate = date.toISOString().substring(0, 10);

  //   return (
  //     <tr key={formattedDate}>
  //       <td>{formattedDate}</td>
  //     </tr>
  //   );
  // });


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
  }, [reportsubmit, fromdate, todate]);
  const styles = {
    pagebreak: {
      pageBreakAfter: 'always'
    }
  };
  const generateTable = (startDate, endDate, dataTable) => {
    const tableData = [];
    const currentDate = new Date(startDate);

    // Set the currentDate to the start of the day (12 AM)
    currentDate.setHours(0, 0, 0, 0);

    // Create a new Date object for the endDate and set the hours, minutes, seconds, and milliseconds
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedTime = `${formattedHour}:00:00 ${ampm}`;
      timeSlots.push(formattedTime);
    }

    while (currentDate <= endDateTime) {
      const formattedDate = currentDate.toLocaleString('default', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const row = (
        <>
        {
          timeSlots.map((ts, i) => {
            if(i === 0) {
              return <tr key={`row-${formattedDate}`} className='inner-table'>
              <td rowSpan={timeSlots.length}>{formattedDate}</td>
              <td>
                {ts}
              </td>
              {
                  MINUTES_DATA.map(m =>  <td key={m}>{dataTable[i]?.[m] || ''}</td>)
                }
           
            </tr>
            } 
            return  <tr> 
              <td>{ts} </td>
              {
                  MINUTES_DATA.map(m =>  <td key={m}>{dataTable[i]?.[m] || ''}</td>)
                }
              </tr>
          } )
        }
        
        </>
      );

      tableData.push(row);

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return tableData;
  };

 

  const tableRows = (dataTable) => generateTable(fromdate, todate, dataTable);
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
                {clients.length > 1 ? (
                  [
                    <MenuItem key="empty" value="empty">Select Client</MenuItem>,
                    clients.map((options) => (
                      <MenuItem key={options.id} value={options.id}>
                        {options.name}
                      </MenuItem>
                    ))
                  ]
                ) : (
                  [
                    <MenuItem key="empty" value="empty">Select Client</MenuItem>,
                    clients && (
                      <MenuItem key={clients.id} value={clients.id}>
                        {clients.name}
                      </MenuItem>
                    )
                  ]
                )}
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

        {/* { {reportdata.length === 0 ? (<></>) : (
   
      < PDFDownloadLink document={<Reportview reportdataValues={ [reportdataValues , dateArray] } />} fileName="Vibrationsensor" >
       {({ loading }) => loading ? (<Button variant="contained" endIcon={<FileDownloadIcon />}>Loading Document...</Button>) : (<Button variant="contained" endIcon={<FileDownloadIcon />}>Download</Button>)}
      </PDFDownloadLink>            
      )} } */}

        {<PDFDownloadLink document={<Reportview newfromdate={newfromdate} newtodate={newtodate} headerItem="name" reportdata={reportdata} client_id={client_id} dateArray={dateArray} />} fileName="Vibrationsensor" >
          {({ loading }) => loading ? (<Button variant="contained" endIcon={<FileDownloadIcon />}>Loading Document...</Button>) : (<Button variant="contained" endIcon={<FileDownloadIcon />}>Download</Button>)}
        </PDFDownloadLink>}
        <button onClick={handleDownload}>Download PDF</button>

      </div>

      {loading == false ? <></> : <div style={loaderdiv}>
        <img src="../../loader.gif" alt="Loading..." style={loader} />
      </div>
      }
      {Object.values(reportdata).map((arr) => {
        console.log(arr)
         console.log(formatReportDataToTable(arr))
         const dataTable = formatReportDataToTable(arr);
        return  <div>
        <h1>{Array.from(new Set(arr.map((item) => item.sensor_id)))}</h1>
        <table >
          <thead>
            <tr>
              <th>Date</th>
              <th>Time hr/5min</th>
              {
                MINUTES_DATA.map(m =>  <th style={{ textAlign: 'center'}} key={m}>{m}</th>)
              } 
            </tr>
          </thead>
          <tbody>
            {tableRows(dataTable).map((row) => row)
            }
          </tbody>
        </table>
      </div>
       }
      )}
    </div>
  )



}

export default Reports;