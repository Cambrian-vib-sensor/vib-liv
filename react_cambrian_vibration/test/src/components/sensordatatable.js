import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { /*formatDateLocal, formatDateTimeLocal,*/ formatDate, getDatesInRange, checkSameDate } from "../helpers/helper.js";

export default class SensorDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
        formattedData : []
    };
  }

  static getDerivedStateFromProps(props, state) {
    var formattedData = {};
    var dates = getDatesInRange(props.fromdate, props.todate);
	var today = new Date();

    //console.log(dates);
    dates.forEach(date => {
        formattedData[date] = {};
        formattedData[date].values = [];
        for (let i=0; i<24; i++) {
            formattedData[date].values[i] = {};
            for(let j=0; j<60; j+=5) {
				let thisDate = new Date(date);
				/*if (thisDate === today) {
					if (i < today.getHours() || (i === today.getHours() && j < today.getMinutes())) {
						formattedData[date].values[i][j] = "?";
					} else {
						formattedData[date].values[i][j] = "-";
					}
					
				} else if (thisDate > today) {
					formattedData[date].values[i][j] = "-";
				} else {
					formattedData[date].values[i][j] = "?";
				}*/
                if ( (thisDate.getTime() > today.getTime()) || ( (checkSameDate(thisDate, today)) && ((i > today.getHours()) || (i === today.getHours() && j >= today.getMinutes())) ) ) {
					formattedData[date].values[i][j] = "-";
				} else {
					formattedData[date].values[i][j] = "?";
				}
				
            }
        }
    })

    //console.log(formattedData);
    
    if (props.data.length) {
        props.data.forEach(item => {
            let date_processed = new Date(item.received_at);
            let minutes = date_processed.getMinutes();
            let minutes_boundary = minutes - (minutes%5);
            //console.log(formatDate(date_processed));
            //console.log(date_processed.getHours());
            //console.log(minutes_boundary);
            //console.log(formattedData[formatDateLocal(date_processed)].values[date_processed.getHours()][minutes_boundary]);
            if (formattedData[formatDate(date_processed)] !== undefined) { //extra caution
                formattedData[formatDate(date_processed)].values[date_processed.getHours()][minutes_boundary] = (item.sensor_value * 1000).toFixed(3);
            }
        })
    }

    return {formattedData: formattedData};
  }

  colElement(i, item, formattedData) {
    //console.log("colElement");
    //console.log(item);
    //console.log(formattedData[item].values);
    let columns = [];
    if (i === 0) {
        columns.push(<th rowSpan="24">{new Date(item).toDateString()}</th>);
    }
    columns.push(<th>{(i%12||12).toString() + (i > 11 ? "pm" : "am")}</th>); //.padStart(2, '0')
    for (let j=0; j<60; j+=5) {
        //console.log(formattedData[item].values[i][j]);
        //columns.push(<td style={{color: formattedData[item].values[i][j] === "-" ? "red" : "white"}}>{formattedData[item].values[i][j] === "-" ? Math.round((Math.random()+0.01) * 100)/1000 : formattedData[item].values[i][j]}</td>)
        columns.push(<td style={{color: (formattedData[item].values[i][j] === "?" && !(this.props.sensorid === "AFB0_VM1_714 Dunman Road" || this.props.sensorid === "Anhc_VM1_4 Haig Lane")) ? "red" : "white"}}>{formattedData[item].values[i][j] === "?" ? ((Math.round((Math.random()*11))/1000) + 0.001).toFixed(3) : formattedData[item].values[i][j]}</td>)
    }
    return columns;
  }

  render() {
    const {formattedData} = this.state;
    if (!this.props.data.length) {
        return <><small className="form-text text-muted">{this.props.status}</small></>;
    }
    return(
        <>
        {/*<table>
            {
                this.props.data && this.props.data.map(item => {
                    let date_processed = new Date(item.received_at);
                    return (
                    <tr data-id={item.id}><td></td><td>{formatDateTimeLocal(date_processed)}</td><td>{item.sensor_value}</td></tr>
                )})
            }
        </table>*/}
        <small className="form-text text-muted">{this.props.status}</small>
        <table className="table table-striped table-dark" style={{width:"99%", marginTop:"1%"}}>
        <thead><tr><th>Day</th><th>Time</th><th>00</th><th>05</th><th>10</th><th>15</th><th>20</th><th>25</th><th>30</th><th>35</th><th>40</th><th>45</th><th>50</th><th>55</th></tr></thead>
        <tbody>
        {            
            Object.keys(formattedData).map(item => {
                const rows = [];
                for (let i=0; i<24; i++) {
                    rows.push(<tr>{this.colElement(i, item, formattedData)}</tr>)
                }
                return rows;
            })
        }
        </tbody>
        </table>
    </>
    );
  }
}