import Box from "@mui/material/Box";
import React  from 'react';
import TextField from "@mui/material/TextField";

const AddDeviceForm = ({ details, handleChange, isLoading }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        sx={{ mt: 2 }}
        id="device-channelId"
        name="channelId"
        label="channel Id"
        variant="filled"
        fullWidth
        value={details.channelId}
        disabled={isLoading}
        onChange={handleChange}
      />
      <TextField
        sx={{ mt: 2 }}
        id="device-readAPIKey"
        name="readAPIKey"
        label="Read API Key"
        variant="filled"
        fullWidth
        disabled={isLoading}
        value={details.readAPIKey}
        onChange={handleChange}
      />
      <TextField
        sx={{ mt: 2 }}
        id="device-writeAPIKey"
        name="writeAPIKey"
        label="Write API Key"
        variant="filled"
        fullWidth
        value={details.writeAPIKey}
        disabled={isLoading}
        onChange={handleChange}
      />
    </Box>
  );
};

export default AddDeviceForm;
