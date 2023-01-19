import React, { Component } from "react"
import VibrationDataService from "../services/vibration.service.js"
//import 'bootstrap/dist/css/bootstrap.min.css'
import { formatDate } from "../helpers/helper.js"
import SensorDataTable from "./sensordatatable.js"


export default class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      search_params: {
        sensorid: "",
        fromdate: formatDate(new Date()),
        todate: formatDate(new Date()),
      },
      status: "",
      search_result: []
    };

    this.handleSensorChange = this.handleSensorChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	  this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    this.retrieveSensorids();
  }

  componentDidUpdate() {
    //console.log("Component Updated");
    //console.log(this.state.search_params);
  }
  
  componentWillUnmount() {
	if (this.timeout !== undefined) {
	  console.log("Clearing timeout");
      clearTimeout(this.timeout);
    }
  }

  handleSensorChange(event) {
    var search_params = {...this.state.search_params};
    search_params.sensorid = event.target.value;
    this.setState({search_params});
    this.setState({search_result:[]});
    this.setState({status: "Sensor changed. Click Search to proceed."});
  }

  handleFromDateChange(event) {
    var search_params = {...this.state.search_params};
    search_params.fromdate = event.target.value;
    this.setState({search_params});
    this.setState({search_result:[]});
    this.setState({status: "Start Date changed. Click Search to proceed."});
  }

  handleToDateChange(event) {
    var search_params = {...this.state.search_params};
    search_params.todate = event.target.value;
    this.setState({search_params});
    this.setState({search_result:[]});
    this.setState({status: "End Date changed. Click Search to proceed."});
  }
  
  retrieveData() {
    console.log("Retrieve Data called");
    var search_params = {...this.state.search_params}; 
    this.setState({status: "Retrieving.."});
    VibrationDataService.getsensorbydaterange(search_params).then(response => {
      this.setState({search_result:response.data});
      this.setState({status: "Results in mm/s.."});
      //console.log(response.data);
    }).catch(error => {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message === "not_found") {
        this.setState({status: "No results"});
      }
    }); 
	
    let today = new Date();
    //let nextTimeout = ((5 - (new Date().getMinutes())%5) * 60000) + 30000;
    let nextTimeout = ((5 - (today.getMinutes()%5)) * 60000) - (today.getSeconds() * 1000) + 30000;
    console.log(nextTimeout);

    this.timeout = setTimeout(this.retrieveData, nextTimeout);
  }

  handleSubmit(event) {
    var search_params = {...this.state.search_params};

    if (search_params.sensorid === "") {
      alert("Please choose a sensor");
      return;
    }

    if (search_params.fromdate > search_params.todate) {
      alert("Daterange is not proper");
      return;
    }
	
    if (this.timeout !== undefined) {
      console.log("Clearing timeout");
        clearTimeout(this.timeout);
      }
    
    this.retrieveData();
  }

  retrieveSensorids() {
    VibrationDataService.getsensoridlist().then(response => {
      this.setState({sensors:response.data});
      /*if (this.state.sensors) {
        var search_params = {...this.state.search_params};
        search_params.sensorid = this.state.sensors[0].sensorid;
        this.setState({search_params});
      }*/
      //console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }

  render() {
    const {sensors, search_params, search_result, status} = this.state;
    return(
      <div style={{margin:"1%"}}>
      <div className="row">
        <div className="col-md-3 form-group">
          <label htmlFor="sensorlist">Sensor id:</label>
          <select className="form-control" value={search_params.sensorid} onChange={this.handleSensorChange} name="sensorlist" id="sensorlist">
            <option key="" value="">Select a sensor</option>
            {
              sensors && sensors.map((sensor, index) => (
                <option key={sensor.sensorid} value={sensor.sensorid}>
                  {sensor.sensorid}
                </option>
              ))
            }
          </select>
          {/*<small id="sensorlistHelp" class="form-text text-muted">Choose a sensor id</small>*/}
        </div>
        <div className="col-md-3 form-group">
          <label htmlFor="fromdate">From:</label>
          <input type="date" id="fromdate" className="form-control" value={search_params.fromdate} onChange={this.handleFromDateChange} name="fromdate"></input>
        </div>
        <div className="col-md-3 form-group">
          <label htmlFor="todate">Until:</label>
          <input type="date" id="todate" className="form-control" value={search_params.todate} onChange={this.handleToDateChange} name="todate"></input>
        </div>
        <div className="col-md-3 form-group">
          <br />
          <button type="button" id="search" className="btn btn-secondary" onClick={this.handleSubmit}>Search</button>
        </div>
      </div>
      <div className="row">
          <SensorDataTable data={search_result} fromdate={search_params.fromdate} todate={search_params.todate} status={status} sensorid={search_params.sensorid}/>
      </div>
      </div>
    );
  }
}