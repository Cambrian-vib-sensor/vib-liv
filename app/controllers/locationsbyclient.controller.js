const db = require("../models");
const Location = db.location;
const { Op } = require("sequelize");

exports.findAllActiveLocationsByClient = (req, res)=> {
  Location.findAll({
    where: {
      client_id: {
        [Op.eq]: req.params.client_id },
      // status:{ 

      //      [Op.eq]:'A'
    
      // },
    },
  })
 .then((data) => {
  
  res.send(data);
  console.log(data);
})
.catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred while retrieving location info."
  });
});
};





