import React, { Component } from "react"
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import { Grid } from '@mui/material';
import { useRef } from "react"
import { useEffect,useState,useMemo} from "react";
import VibrationDataService from "../services/vibration.service.js";
//import Searchbox from "./searchbox.js";
import am4geodata_singaporeHigh from '@amcharts/amcharts4-geodata/singaporeHigh';


const DashboardContent = (props) => {

  const [mapData, setmapData] = useState(null);
  const [xychatData, setxychatData] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  const chartMapMemo = useMemo(() => {
    async function fetchMapData() {

      console.log("userinfo",props.userInfo);

      try {
        const response = await VibrationDataService.getSensorDetailsForDashboardMap();
        const data = response.data;
        setmapData(data);
  
        am4core.useTheme(am4themes_animated);
        let chartmap = am4core.create('chartdiv', am4maps.MapChart);
        chartmap.geodata = am4geodata_singaporeHigh;
  
        chartmap.projection = new am4maps.projections.Miller();
  
        let polygonSeries = chartmap.series.push(new am4maps.MapPolygonSeries());
  
        polygonSeries.useGeodata = true;
        polygonSeries.exclude = ['AQ'];
        polygonSeries.mapPolygons.template.nonScalingStroke = true;
        let imageSeries = chartmap.series.push(new am4maps.MapImageSeries());
        imageSeries.data = data;
        let imageTemplate = imageSeries.mapImages.template;
        let circle = imageTemplate.createChild(am4core.Circle);
        circle.radius = 8;
        imageTemplate.propertyFields.latitude = 'location_lat';
        imageTemplate.propertyFields.longitude = 'location_lng';
        imageTemplate.tooltipText = '{sensor_id} - freq:{frequency} - Lat:{location_lat} - Lng:{location_lng}';
        console.log("dataItem",dataItem);
        // set fill color based on frequency
        imageTemplate.propertyFields.fill = function(dataItem) {
          if (dataItem && dataItem.dataContext && dataItem.dataContext.frequency) {
            const frequency = dataItem.dataContext.frequency;
            if (frequency >= 6) {
              console.log("six");
              return am4core.color("#FB1C07"); // Red
            } else if (frequency >= 3) {
              console.log("3");
              return am4core.color("#F7891C"); // Orange
            } else {
              console.log("<3");
              return am4core.color("#4CAF50"); // Green
            }
          }
          return am4core.color("yellow"); // Default color if data or frequency is not defined
        };  
        console.log("No");
        imageTemplate.events.on("inited", function(event) {
          let image = event.target;
          let circle = image.children.getIndex(0);
          circle.fill = image.dataItem.dataContext.fill;
        });  
        chartmap.zoomControl = new am4maps.ZoomControl();
        // Zoom into Singapore
        chartmap.zoomToRectangle(
          chartmap.north + 0.2,
          chartmap.east - 0.2,
          chartmap.south - 0.2,
          chartmap.west + 0.2,
          1000 // duration in ms
        );    
        return () => {
          chartmap.dispose();
        };
      } catch (error) {
        setError(error);
      }
    }
    fetchMapData();
    }, []);

  useEffect(() => {
    async function fetchXychartData() {
      try {
        const response = await VibrationDataService.getsensordetailsfordashboardbar();
        setxychatData(response.data)
        am4core.useTheme(am4themes_animated);
      // Create chart instance
      const chart = am4core.create('SalesChart', am4charts.XYChart);
      // Add data
      chart.data = response.data;
       // Create axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.dateFormats.setKey('hour', 'HH:mm');
      dateAxis.dateFormats.setKey('day', 'MM-dd');
      dateAxis.dateFormats.setKey('month', 'MM-dd');
      dateAxis.dateFormats.setKey('year', 'yyyy');
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
      // Create series
      const series = chart.series.push(new am4charts.LineSeries());
      console.log("series",series);
      series.dataFields.dateX = 'received_at';
      series.dataFields.valueY = 'sensor_value';
      series.tooltipText = '{valueY.sensor_value}';
      series.fillOpacity = 0.3;
      // Add scrollbar
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series);
      // Dispose chart when component unmounts
      return () => {
        chart.dispose();
      };
      } catch (error) {
        setError(error);
      }
    }
    fetchXychartData();
  }, []);
   return (
    <div> 
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
            <div id="SalesChart" style={{ width: "100%", height: "500px" }}></div>
            </Grid>
            <Grid item xs={6}>
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}>
            {chartMapMemo}
            </div>
            </Grid>      
          </Grid>
     </div>
    );
    }   
   

   export default DashboardContent;