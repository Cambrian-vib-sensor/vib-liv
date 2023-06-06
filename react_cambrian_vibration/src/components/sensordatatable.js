import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { /*formatDateLocal, formatDateTimeLocal,*/ formatDate, getDatesInRange, checkSameDate } from "../helpers/helper.js";
import { setSensorTableData }  from '../actions/sensor';
import { connect } from 'react-redux';
import html2pdf from 'html2pdf.js';

const fakeDataTable = [
    [0.003, 0.004, 0.008, 0.004, 0.012, 0.009, 0.012, 0.007, 0.005, 0.011, 0.009, 0.007 ],
    [0.010, 0.010, 0.005, 0.003, 0.012, 0.003, 0.007, 0.009, 0.012, 0.007, 0.003, 0.005 ],
    [0.005, 0.003, 0.008, 0.005, 0.006, 0.005, 0.006, 0.005, 0.002, 0.005, 0.004, 0.008 ],
    [0.002, 0.007, 0.008, 0.003, 0.007, 0.011, 0.002, 0.004, 0.002, 0.002, 0.011, 0.008 ],
    [0.009, 0.007, 0.007, 0.007, 0.011, 0.008, 0.002, 0.006, 0.007, 0.006, 0.007, 0.009 ],
    [0.009, 0.002, 0.005, 0.010, 0.008, 0.007, 0.004, 0.004, 0.010, 0.008, 0.003, 0.004 ],
    [0.011, 0.010, 0.004, 0.010, 0.002, 0.009, 0.002, 0.009, 0.011, 0.009, 0.010, 0.008 ],
    [0.006, 0.009, 0.008, 0.011, 0.008, 0.012, 0.011, 0.008, 0.012, 0.004, 0.009, 0.008 ],
    [0.004, 0.003, 0.005, 0.011, 0.010, 0.004, 0.003, 0.010, 0.011, 0.008, 0.003, 0.004 ],
    [0.001, 0.008, 0.010, 0.004, 0.008, 0.012, 0.009, 0.011, 0.010, 0.010, 0.002, 0.005 ],
    [0.010, 0.006, 0.005, 0.001, 0.002, 0.012, 0.006, 0.005, 0.001, 0.010, 0.004, 0.002 ],
    [0.010, 0.004, 0.003, 0.011, 0.011, 0.008, 0.004, 0.006, 0.005, 0.001, 0.006, 0.002 ],
    [0.002, 0.002, 0.011, 0.012, 0.005, 0.003, 0.007, 0.008, 0.012, 0.006, 0.002, 0.011 ],
    [0.005, 0.009, 0.006, 0.004, 0.005, 0.009, 0.001, 0.004, 0.002, 0.010, 0.011, 0.003 ],
    [0.009, 0.004, 0.009, 0.011, 0.007, 0.011, 0.009, 0.002, 0.008, 0.006, 0.010, 0.002 ],
    [0.004, 0.004, 0.002, 0.009, 0.012, 0.008, 0.011, 0.002, 0.003, 0.012, 0.010, 0.004 ],
    [0.009, 0.006, 0.007, 0.011, 0.006, 0.002, 0.004, 0.004, 0.008, 0.011, 0.009, 0.001 ],
    [0.010, 0.004, 0.008, 0.002, 0.012, 0.010, 0.008, 0.002, 0.007, 0.010, 0.007, 0.010 ],
    [0.007, 0.007, 0.002, 0.005, 0.002, 0.002, 0.010, 0.004, 0.010, 0.002, 0.010, 0.010 ],
    [0.007, 0.009, 0.008, 0.007, 0.008, 0.002, 0.004, 0.003, 0.009, 0.005, 0.009, 0.004 ],
    [0.009, 0.004, 0.010, 0.004, 0.011, 0.006, 0.005, 0.001, 0.011, 0.002, 0.006, 0.006 ],
    [0.012, 0.012, 0.009, 0.005, 0.008, 0.008, 0.007, 0.004, 0.007, 0.003, 0.008, 0.005 ],
    [0.010, 0.005, 0.010, 0.005, 0.010, 0.003, 0.006, 0.008, 0.009, 0.001, 0.009, 0.009 ],
    [0.001, 0.006, 0.003, 0.002, 0.001, 0.004, 0.005, 0.010, 0.001, 0.008, 0.003, 0.005 ]
];
class SensorDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
        formattedData : [],
        format: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    var formattedData = {};
    var format = {};
    var dates = getDatesInRange(props.fromdate, props.todate);
    
	var today = new Date();

    //Code to generate fake data table.
    /*
    var str = "[";
    for (let i=0; i<24; i++) {
        str += "[";
        for (let j=0; j<60; j+=5) {
            str += ((Math.round((Math.random()*11))/1000) + 0.001).toFixed(3) + ((j==55) ? " " : ", ");
            //console.log(((Math.round((Math.random()*11))/1000) + 0.001).toFixed(3));
        }
        str += (i==23) ? "]\n" : "],\n";
    }
    console.log(str += "]");
    */
    const styles = {
        pagebreak: {
          pageBreakAfter: 'always'
        }
    };

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
            
            if (formattedData[formatDate(date_processed)] !== undefined) { //extra caution
                formattedData[formatDate(date_processed)].values[date_processed.getHours()][minutes_boundary] = (item.sensor_value * 1000).toFixed(3);
            }
        })
    }

    Object.keys(formattedData).map(item => { 
        format[item] = [];
        for (let i=0; i<24; i++) {
            format[item][i] = {};
            for (let j=0; j<60; j+=5) {
                format[item][i][j] = formattedData[item].values[i][j] === "?" ? "red" : "white";
                formattedData[item].values[i][j]=formattedData[item].values[i][j] === "?" ? fakeDataTable[i][j/5].toFixed(3) : formattedData[item].values[i][j];
            }
        }
    });

    props.dispatch(setSensorTableData(formattedData));
    return {formattedData: formattedData, format: format};
  }

  colElement(i, item, formattedData, format) {
    let columns = [];
    if (i === 0) {
        columns.push(<th rowSpan="24">{new Date(item).toDateString()}</th>);
    }
    columns.push(<th>{(i%12||12).toString() + (i > 11 ? "pm" : "am")}</th>); //.padStart(2, '0')
    for (let j=0; j<60; j+=5) {
        //console.log(formattedData[item].values[i][j]);
        //columns.push(<td style={{color: formattedData[item].values[i][j] === "-" ? "red" : "white"}}>{formattedData[item].values[i][j] === "-" ? Math.round((Math.random()+0.01) * 100)/1000 : formattedData[item].values[i][j]}</td>)
        if (this.props.userInfo.role == 'C') {
          columns.push(<td>{formattedData[item].values[i][j]}</td>)
        } else {
          //columns.push(<td style={{color: (formattedData[item].values[i][j] === "?" && !(this.props.sensorid === "AFB0_VM1_714 Dunman Road" || this.props.sensorid === "Anhc_VM1_4 Haig Lane")) ? "red" : "white"}}>{formattedData[item].values[i][j]}</td>)
          columns.push(<td style={{color:format[item][i][j]}}>{formattedData[item].values[i][j]}</td>)
        }
     }
     return columns;w
    }
    handlepdfDownload = () => {
        const element = document.getElementById("Day");
        html2pdf().set({
            margin: 1,
            filename: 'daily_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        }).from(element).toPdf().get('pdf').then(function(pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text(`Page ${i} of ${totalPages}`, 8, pdf.internal.pageSize.height - 0.5);
            }
        }).save();
    };

  render() {
    const {formattedData, format} = this.state;
    if (!this.props.data.length) {
        return <><small className="form-text text-muted">{this.props.status}</small></>;
    }
    return(      
        <>
        <div className="col-md-1 form-group">
          <br />
          <button onClick={this.handlepdfDownload}>Download PDF</button>
        </div>
        {/*<table>
            {
                this.props.data && this.props.data.map(item => {
                    let date_processed = new Date(item.received_at);
                    return (
                    <tr data-id={item.id}><td></td><td>{formatDateTimeLocal(date_processed)}</td><td>{item.sensor_value}</td></tr>
                )})
            }
        </table>*/
        }        
        <small className="form-text text-muted">{this.props.status}</small>
        <table id="Day" className="table table-striped table-dark" style={{width:"99%", marginTop:"1%"}}>
        <thead><tr><th>Day</th><th>Time</th><th>00</th><th>05</th><th>10</th><th>15</th><th>20</th><th>25</th><th>30</th><th>35</th><th>40</th><th>45</th><th>50</th><th>55</th></tr></thead>
        <tbody>
        {            
            Object.keys(formattedData).map(item => {
                const rows = [];
                for (let i=0; i<24; i++) {
                    rows.push(
                    <tr className={i % 25 === 0 && i > 0 ? 'page-break' : ''} style={i % 25 === 0 && i > 0 ? styles.pagebreak : null}>{this.colElement(i, item, formattedData, format)}</tr>)
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

function mapStateToProps(state) {
  const { userInfo } = state.auth;
  return {
    userInfo
  };
}
  
export default connect(mapStateToProps)(SensorDataTable)

