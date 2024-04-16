import { useEffect, useState, useCallback } from "react";
import React  from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import ShowGraphs from "../Components/ShowGraphs";
import DeleteModal from "./DeleteModal";
import AddModuleModal from "./AddModule";
import DeleteModule from "./DeleteModule";

const ShowProject = ({ project, deleteProject, updateProject }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState("");
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteModule, setDeleteModule] = useState(false);
  const [moduleModal, setModuleModal] = useState(false);

  const fetchFeeds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(
        `https://api.thingspeak.com/channels/${project.channelId}/feeds.json?api_key=${project.readAPIKey}`
      );
      const { feeds } = await response.json();
      setFeeds(feeds);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      fetchFeeds();
    }
  }, [fetchFeeds, project]);

  const handleDelete = () => {
    setDeleteModel(true);
  };
  const handleDeleteModule = () => {
    setDeleteModule(true);
  };
  const closeDeleteModal = () => {
    setDeleteModel(false);
  };
  const closeDeleteModule = () => {
    setDeleteModule(false);
  };

  const openModuleModule = () => {
    setModuleModal(true);
  };

  const closeModuleModal = () => {
    setModuleModal(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <DeleteModal
        open={deleteModel}
        onClose={closeDeleteModal}
        id={project.id}
        name={project.name}
        deleteProject={deleteProject}
      />
      <DeleteModule
        open={deleteModule}
        onClose={closeDeleteModule}
        module={project.modules[0]}
        name="Distance weight"
        deleteProject={deleteProject}
      />
      <AddModuleModal open={moduleModal} onClose={closeModuleModal} project={project} updateProject={updateProject} />
      <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
        <Box sx={{ justifyContent: "space-between", flexDirection: "column", display: "inline-flex" }}>
          <Typography variant="h5" component="span">
            {project.name}
          </Typography>
          <Typography variant="caption" component="span">
            {project.channelId}
          </Typography>
        </Box>
        <Box>
          <Button variant="outlined" onClick={openModuleModule} sx={{ mx: 2 }}>
            Add Module
          </Button>
          {/* <Button variant="outlined" onClick={handleDeleteModule} color="error" sx={{ mx: 2 }}>
            Delete Module
          </Button> */}
          <Button variant="outlined" onClick={handleDelete} color="error" sx={{ mx: 2 }}>
            Delete Device
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ width: "100%", p: 3 }}>
        {isLoading && <LinearProgress />}
        {error && <Typography variant="caption">{error}</Typography>}
        {!isLoading && feeds.length === 0 && (
          <Typography variant="h4" align="center">
            No feeds found, please use the sensor for some time
          </Typography>
        )}
        {!isLoading && feeds.length > 0 && <ShowGraphs feeds={feeds} channel={project} fetchFeeds={fetchFeeds} />}
      </Box>
    </Box>
  );
};

export default ShowProject;
