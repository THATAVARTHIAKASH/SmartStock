import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import React  from 'react';
import Typography from "@mui/material/Typography";
import Sidebar from "../Components/Sidebar";

import { collection, query, where, getDocs } from "firebase/firestore";
import { firebaseDB } from "../firebase";

import { useAuth } from "../Context/MyContext";

import AddDevice from "../Components/AddDevice";
import ShowProject from "../Components/ShowProject";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenModel = () => {
    setOpenModal(true);
  };
  const handleCloseModel = () => {
    setOpenModal(false);
  };
  const changeActiveProject = (id) => {
    setActiveProject(id);
  };

  const getProjects = useCallback(async () => {
    if (currentUser.uid) {
      setIsLoading(true);
      const q = query(collection(firebaseDB, "projects"), where("uid", "==", currentUser.uid));
      const response = await getDocs(q);
      const projects = [];
      response.forEach((doc) => {
        projects.push({ ...doc.data(), id: doc.id });
      });
      setAllProjects(projects);
      setIsLoading(false);
    }
  }, [currentUser.uid]);

  useEffect(() => {
    if (currentUser.uid) {
      getProjects();
    }
  }, [currentUser, getProjects]);

  const addNewProject = (project) => {
    setAllProjects([...allProjects, project]);
  };
  const updateProject = (project) => {
    const newProjects = allProjects.map((p) => {
      if (p.id === project.id) return project;
      return p;
    });
    setAllProjects(newProjects);
  };
  const deleteProject = (project) => {
    setActiveProject(null);
    setAllProjects(allProjects.filter((p) => p.id !== project));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AddDevice open={openModal} handleCloseModel={handleCloseModel} addNewProject={addNewProject} />
      <Sidebar
        handleOpenModel={handleOpenModel}
        projects={allProjects}
        changeActiveProject={changeActiveProject}
        isLoading={isLoading}
      />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 2 }}>
        <Typography variant="caption" component="span">
          Logged in as:
          <Typography variant="subtitle2">{currentUser.email}</Typography>
        </Typography>
        <Box sx={{ display: "flex", mt: 2, flexGrow: 1 }}>
          {!activeProject && (
            <Typography variant="h5" align="center">
              Select a Device to view Analytics
            </Typography>
          )}
          {activeProject && (
            <ShowProject
              project={allProjects.find((project) => project.id === activeProject)}
              deleteProject={deleteProject}
              updateProject={updateProject}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
