import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300                              
  },
  indeterminateColor: {
    color: "#f50057"
  },
  selectAllText: {
    fontWeight: 500
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
};



const formatReportDataToTable = (reportData) => {
  const result = {}
  if (reportData && reportData.length) {
    reportData.forEach(rp => {
      const hour = moment(rp.received_at).hour()
      const date = moment(rp.received_at).date()
  
      const minute = Math.round(moment(rp.received_at).minute() / 5) * 5;

      const hoursValue = result[date]?.[hour] || []
      const minuteValues = result[date]?.[hour]?.[minute] || []

      const hoursValueTemp = {
        ...hoursValue,
        [minute]: minuteValues.concat([(rp.sensor_value * 1000).toFixed(3)]) // format value here.let check on that code
      }

      result[date] = {
        ...result[date],
        [hour]: hoursValueTemp
      }
    });
  }
  return result
}

const formatReportDataToTablePDF = (reportData) => {
  const result = {}
  if (reportData && reportData.length) {
    reportData.forEach(rp => {
      const key = moment(rp.received_at).format('DD-MMM-YYYY')
      if (result[key]  && result[key] === 'Exceeding') {

      } else {
        result[key] = rp.sensor_value >= rp.vibration_max_limit ? `Exceeding ${rp.vibration_max_limit} with 
        ${rp.sensor_value} mm/s between 1 Hz – 80 Hz at ${moment(rp.received_at).format('HH:mm')} ` : 'Not Exceeding'
      }
    });
  }
  return result
}


export { useStyles, MenuProps, formatReportDataToTable, formatReportDataToTablePDF };
