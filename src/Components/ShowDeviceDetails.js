import Box from "@mui/material/Box";
import React  from 'react';
import Typography from "@mui/material/Typography";

const ShowDeviceDetails = ({ details }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {Object.keys(details).map((key, index) => {
        return (
          <Typography key={index}>
            {key}: {details[key]}
          </Typography>
        );
      })}
    </Box>
  );
};

export default ShowDeviceDetails;
