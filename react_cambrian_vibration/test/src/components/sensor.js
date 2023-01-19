import React from 'react';

const Sensor = () => {
  const greeting = 'Sensors';

  return <Headline value={greeting} />;
};

const Headline = ({ value }) =>
  <h1>{value}</h1>;

export default Sensor;