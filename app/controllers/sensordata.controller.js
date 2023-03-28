const { sensordata, sensor } = require("../models");
const db = require("../models");
const SensorData = db.sensordata;
const Sensor= db.sensor;
const Location= db.location;
const Op =  db.Sequelize.Op;
const seqWhere = db.Sequelize.where;
const seqFn = db.Sequelize.fn;
const seqCol = db.Sequelize.col;

exports.findAll = (req, res)=> {
    if (req.body.fromdate && req.body.sensorid) {

      let todate = new Date().toDateString();
      if (req.body.todate) todate = req.body.todate;

      //var condition = {sensor_id: req.body.sensorid, received_at: {[Op.between]: [req.body.fromdate, todate]}};      
      var condition = {[Op.and]: [
        {sensor_id: req.body.sensorid},
        seqWhere(seqFn('date', seqCol('received_at')), {[Op.between]: [req.body.fromdate, todate]})
      ]};
      SensorData.findAll({where: condition})
      .then((data) => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving sensor data."
        });
      });
    } else {
      res.status(500).send({message: "Missing params"});
    }
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    SensorData.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find sensor data with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving sensor data with id=" + id
      });
    });
};

exports.findSensorIds = (req, res) => {
  let query, metadata;
  if (req.role === 'A' || req.role === 'U') {
    query = "Select `sensor_id` as sensorid from `sensors` s left join `locations` l on l.id = s.location_id left join `clients` c on l.client_id = c.id where state='G'";
    //query = "Select `sensor_id` as sensorid from (SELECT distinct `sensor_id`, max(`received_at`) as `maxi`FROM `sensordata` group by `sensor_id` order by substring(`sensor_id`, 1, 4), `maxi` DESC) A  group by substring(`sensor_id`, 1, 4)";
    metadata = { type: db.sequelize.QueryTypes.SELECT };
  } else if (req.role === 'C') {
    query = "Select `sensor_id` as sensorid from `sensors` s left join `locations` l on l.id = s.location_id left join `clients` c on l.client_id = c.id where c.id=?";
    metadata = { replacements: [req.clientId], type: db.sequelize.QueryTypes.SELECT };
  } else {
    res.status(404).send({
      message: `Invalid authorization`
    });
    return;
  }
  //db.sequelize.query("Select `sensor_id` as sensorid from (SELECT distinct `sensor_id`, max(`received_at`) as `maxi` FROM `sensordata` group by `sensor_id` order by substring(`sensor_id`, 1, 4), `maxi` DESC) A group by substring(`sensor_id`, 1, 4)", { type: db.sequelize.QueryTypes.SELECT })
  db.sequelize.query(query, metadata)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Error finding sensor ids`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: err.message //"Error retrieving sensor ids"
    });
  });
}

exports.findreportdata = async (req,res) => {

  const reportdata = req.query.data;
  const sensor_name=reportdata.reportsensorids;
  
  // Array to hold specific values
  //const specificsensors_name = [];
  
  // Check for specific values and push them into the new array
  // for (let i = 0; i < sensor_name.length; i++) {
  //   if (sensor_name[i] === 'AFlU_VM3R_MAH (MRI)') { // checking if the value matches the particular value to be removed
  //     specificsensors_name.push(sensor_name.splice(i, 1)[0]); // removing the value from original array and adding it to removed array
  //     i--; // to handle the index change after removing the value from array
  //   }
  // }

  const sensors = sensor_name.map(item => `'${item}'`);
  // const specificsensors = specificsensors_name.map(item => `'${item}'`);
  // console.log("specific sensors",specificsensors);
 
  if (sensors.length!=0) {
   
  let fromdate=reportdata.reportfromdate;
  let todate=reportdata.reporttodate;

  console.log("name",sensors);

  console.log("fromdate",fromdate);
  console.log("todate",todate);

if(fromdate=='' && todate==''){

  console.log("both empty");
  //query = ` SELECT * FROM sensordata WHERE sensor_id IN (SELECT ${sensor} FROM sensors) AND sensordata.sensor_value>=0.014 OR sensordata.sensor_value>=0.0125 OR sensordata.sensor_value>=0.1 AND sensordata.received_at <= CURDATE()`;
  query = `SELECT locations.id,locations.name,sensors.location_id,sensors.sensor_id, sensordata.* FROM sensordata 
  INNER JOIN sensors ON sensors.sensor_id = sensordata.sensor_id INNER JOIN locations ON locations.id = sensors.location_id 
  WHERE sensordata.sensor_id IN (${sensors}) AND sensordata.received_at <= CURDATE() ORDER BY locations.name `;
  //subquery = `SELECT locations.name,locations.id,sensors.sensor_id FROM sensors INNER JOIN locations ON sensors.location_id = locations.id WHERE sensor_id IN (${sensors})`;
 
  metadata = { type: db.sequelize.QueryTypes.SELECT };

}if(fromdate!='' && todate==''){

  console.log("fromdate",fromdate," to empty");

   query = `SELECT locations.id,locations.name,sensors.sensor_id, sensordata.* FROM sensordata INNER JOIN sensors  ON sensordata.sensor_id = sensors.sensor_id INNER JOIN locations  ON sensors.location_id = locations.id  WHERE locations.status="A" AND sensors.state="G" AND sensordata.sensor_id IN (${sensors}) AND sensordata.received_at BETWEEN ${fromdate} AND <= CURDATE()`;
   metadata = { type: db.sequelize.QueryTypes.SELECT };

}
if(fromdate=='' && todate!=''){

  console.log("from date empty",todate," not empty");

  query = `SELECT locations.id,locations.name,sensors.sensor_id, sensordata.* FROM sensordata INNER JOIN sensors  ON sensordata.sensor_id = sensors.sensor_id INNER JOIN locations  ON sensors.location_id = locations.id WHERE locations.status="A" AND sensors.state="G" AND sensordata.sensor_id IN (${sensors}) AND  sensordata.received_at <= ${todate}`;
  metadata = { type: db.sequelize.QueryTypes.SELECT };
}

if(fromdate!='' && todate!=''){

  console.log(fromdate,todate," both not empty");

  query = `SELECT locations.id,locations.name,sensors.location_id,sensors.sensor_id,sensors.vibration_max_limit,sensordata.* FROM sensordata 
  INNER JOIN sensors ON sensors.sensor_id = sensordata.sensor_id INNER JOIN locations ON locations.id = sensors.location_id 
  WHERE sensordata.sensor_id IN (${sensors}) AND  sensordata.received_at BETWEEN ('${fromdate}') AND ('${todate}')`;
  metadata = { type: db.sequelize.QueryTypes.SELECT };
}

  console.log("report data",query);

  db.sequelize.query(query, metadata) .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Error finding sensor data`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
  }
}

exports.update = (req, res)=> {

};

exports.delete = (req, res)=> {

};

exports.deleteAll = (req, res)=> {

};