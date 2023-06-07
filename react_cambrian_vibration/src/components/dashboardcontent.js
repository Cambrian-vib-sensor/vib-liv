import React, { Component } from "react"

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map.js";
import * as am5xy from "@amcharts/amcharts5/xy.js";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_singaporeHigh from '@amcharts/amcharts5-geodata/singaporeHigh';

import { Grid } from '@mui/material';
import { useRef } from "react"
import { useEffect, useState, useMemo } from "react";
import VibrationDataService from "../services/vibration.service.js";
import './dashboardcontent.css'
//import Searchbox from "./searchbox.js";

const DashboardContent = (props) => {

  const [mapData, setmapData] = useState(null);
  const [xychatData, setxychatData] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  async function fetchMapData(root) {
    try {
      const response = await VibrationDataService.getSensorDetailsForDashboardMap();
      const data = response.data;
      setmapData(data);
      am5.ready(function () {
        // Set themes
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        const chart = root.container.children.push(
          am5map.MapChart.new(root, {})
        );

        chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_singaporeHigh,
            exclude: ["AQ"]
          })
        );
        chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

        const pointSeriesGreen = chart.series.push(am5map.MapPointSeries.new(root, {}));
        const pointSeriesRed = chart.series.push(am5map.MapPointSeries.new(root, {}));
        const pointSeriesOrange = chart.series.push(am5map.MapPointSeries.new(root, {}));

        for (let i = 0; i < data.length; i++) {
          const point = data[i];
          const pointSerie = {
            longitude: point.location_lng,
            latitude: point.location_lat,
            name: `${point.sensor_id} - freq:${point.frequency} - Lat:${point.location_lat} - Lng:${point.location_lng}`,
          }

          // 0 - 3
          if (point.frequency) {
            pointSeriesGreen.pushDataItem(pointSerie);
          }
          // 3 - 5
          if (point.frequency >= 3) {
            pointSeriesOrange.pushDataItem(pointSerie);
          }
          // > 5
          if (point.frequency > 5) {
            pointSeriesRed.pushDataItem(pointSerie);
          }
        }
        const tooltipText = "[fontSize: 12px]{name}"
        pointSeriesGreen.bullets.push(function (value) {
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0x4CAF50),
            tooltipText: tooltipText
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

        pointSeriesRed.bullets.push(function (value) {
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xFB1C07),
            tooltipText: tooltipText
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

        pointSeriesOrange.bullets.push(function (value) {
          const circle = am5.Circle.new(root, {
            radius: 8,
            fill: am5.color(0xF7891C),
            tooltipText: tooltipText
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });
      });

    } catch (error) {
      setError(error);
    }
  }


  useEffect(() => {
    const root = am5.Root.new("chartdiv5");
    fetchMapData(root);
    return () => {
      root.dispose()
    }
  }, [])

  useEffect(() => {
    const root = am5.Root.new("SalesChart");
    async function fetchXychartData() {
      try {
        const response = await VibrationDataService.getsensordetailsfordashboardbar();
        setxychatData(response.data)

        // Create chart instance
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panY: false,
            layout: root.verticalLayout
          })
        );
        // Add data
        chart.data = response.data;
        // Create axes
        const dateAxis = chart.xAxes.push(new am5charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.dateFormats.setKey('hour', 'HH:mm');
        dateAxis.dateFormats.setKey('day', 'MM-dd');
        dateAxis.dateFormats.setKey('month', 'MM-dd');
        dateAxis.dateFormats.setKey('year', 'yyyy');
        const valueAxis = chart.yAxes.push(new am5charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;
        // Create series
        const series = chart.series.push(new am5charts.LineSeries());
        console.log("series", series);
        series.dataFields.dateX = 'received_at';
        series.dataFields.valueY = 'sensor_value';
        series.tooltipText = '{valueY.sensor_value}';
        series.fillOpacity = 0.3;
        // Add scrollbar
        chart.scrollbarX = new am5charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        // Dispose chart when component unmounts
   
      } catch (error) {
        setError(error);
      }
    }
    fetchXychartData();
    
    return () => {
      root.dispose();
    };
  }, []);
  return (
    <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <div id="SalesChart" style={{ width: "100%", height: "500px" }}></div>
        </Grid>
        <Grid item xs={6} >
          <div className="map-container">
            <div id="chartdiv5" style={{ width: "100%", height: "500px", border: '1px solid gray', marginBottom: 24 }}>
            </div>
            <div>
              <AnnotateMap />
            </div>
          </div>
          <div className="map-container">
            <AllSensorsMap />
            <div>
              <AnnotateMap />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}


export default DashboardContent;

const AllSensorsMap = () => {
  useEffect(() => {
    let root = am5.Root.new("all-sensor-map");
    am5.ready(async function () {
      const response = await VibrationDataService.getSensorDetailsForDashboardMap();
      const data = response.data;
      // Set themes
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      const chart = root.container.children.push(
        am5map.MapChart.new(root, {})
      );

      chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_singaporeHigh,
          exclude: ["AQ"]
        })
      );

      chart.set("zoomControl", am5map.ZoomControl.new(root, {}));


      const bubbleSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          valueField: 'value',
          latitudeField: 'latitude',
          longitudeField: 'longitude',
          calculateAggregates: true
        })
      );
      for (let i = 0; i < data.length; i++) {
        const point = data[i];
        const pointSerie = {
          longitude: point.location_lng,
          latitude: point.location_lat,
          value: point.frequency,
          name: `${point.sensor_id}`,
        }

        bubbleSeries.data.push(pointSerie);

      }
      const circleTemplate = am5.Template.new({});

      bubbleSeries.bullets.push(function (root, series, dataItem) {
        const container = am5.Container.new(root, {});

        const circle = container.children.push(
          am5.Circle.new(root, {
            radius: 20,
            fillOpacity: 0.7,
            fill: am5.color(0xff0000),
            cursorOverStyle: "pointer",
            tooltipText: `{name}: [bold]{value}[/]`
          }, circleTemplate)
        );

        const countryLabel = container.children.push(
          am5.Label.new(root, {
            text: "{name}",
            paddingLeft: 5,
            populateText: true,
            fontWeight: "bold",
            fontSize: 13,
            centerY: am5.p50
          })
        );

        circle.on("radius", function (radius) {
          countryLabel.set("x", radius);
        })

        return am5.Bullet.new(root, {
          sprite: container,
          dynamic: true
        });
      });

      bubbleSeries.bullets.push(function (root, series, dataItem) {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "[fontSize: 12px]{value.formatNumber('#.')}",
            fill: am5.color(0xffffff),
            populateText: true,
            centerX: am5.p50,
            centerY: am5.p50,
            textAlign: "center",
          }),
          dynamic: true
        });
      });

      // minValue and maxValue must be set for the animations to work
      bubbleSeries.set("heatRules", [
        {
          target: circleTemplate,
          dataField: "value",
          min: 5,
          max: 20,
          minValue: 0,
          maxValue: 100,
          key: "radius"
        }
      ]);

      function updateData() {
        for (var i = 0; i < bubbleSeries.data.length; i++) {
        bubbleSeries.data.setIndex(i, {
          ...bubbleSeries.data.values[i],
            value: Math.round(Math.random() * 100)
          })
        }
      }

      setInterval(function () {
        updateData();
      }, 2000)
    });

    return () => {
      if (root) {
        root.dispose()
      }
    }

  }, [])
  return (
    <div id="all-sensor-map" style={{ width: "100%", height: "500px", border: '1px solid gray', marginBottom: 24 }}>
    </div>
  )
}

const AnnotateMap = () => {
  return (
    <>
      <table className="annotate-table" border={0}>
        <tr>
          <td><div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#4CAF50', marginRight: 'auto' }}></div></td>
          <td><div style={{ textAlign: "right" }}>0 {'<'} 3</div></td>
        </tr>
        <tr>
          <td><div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#F7891C', marginRight: 'auto' }}></div></td>
          <td><div style={{ textAlign: "right" }}>3 {'<'} 5</div></td>
        </tr>
        <tr>
          <td><div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FB1C07', marginRight: 'auto' }}></div></td>
          <td><div style={{ textAlign: "right" }}>{'<'} 5</div></td>
        </tr>
        <tr><td colSpan={2} style={{ textAlign: "center", fontWeight: '700' }}>Time limit exceeded</td></tr>
      </table>
    </>
  )
}