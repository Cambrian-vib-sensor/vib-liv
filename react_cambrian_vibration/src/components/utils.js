import { makeStyles } from "@material-ui/core/styles";

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

import moment from 'moment'


const formatReportDataToTable = (reportData) => {
  const result = {}
  if (reportData && reportData.length) {
    reportData.forEach(rp => {
      const hour = moment(rp.received_at).hour()
      const minute = Math.round(moment(rp.received_at).minute() / 5) * 5;

      const values = result[hour]?.[minute] || []
      result[hour] = {
        ...result[hour],
        [minute]: values.concat([(rp.sensor_value * 1000).toFixed(3)]) // format value here.let check on that code
      }
    });
  }
  return result

}

export { useStyles, MenuProps, formatReportDataToTable };
