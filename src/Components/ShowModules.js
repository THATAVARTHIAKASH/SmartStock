import DistanceWeight from "./Modules/DistanceWeight";
import FruitStock from "./Modules/FruitStock";
import React  from 'react';
const ShowModules = ({ channel, feeds }) => {
  if (channel.modules && channel.modules.indexOf("distance_weight") > -1)
    return <DistanceWeight channel={channel} feeds={feeds} />;
  if (channel.modules && channel.modules.indexOf("distance_weight") !== -1)
    return <FruitStock channel={channel} feeds={feeds} />;
  return null;
};

export default ShowModules;
