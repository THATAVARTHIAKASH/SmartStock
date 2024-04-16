import React  from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import { doc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../firebase";


const DeleteModule = ({ modules, open, onClose, name,  deleteProject }) => {
    const handleDeleteModule = async () => {
      try {
        await deleteDoc(doc(firebaseDB, "projects", modules));
        deleteProject(modules);
      } catch (err) {
        console.log(err);
      } finally {
        onClose();
      }
    };
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h5">Delete Module ?</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button color="error" onClick={handleDeleteModule}>
              Yes, Delete
            </Button>
            <Button onClick={onClose}>No, Cancel</Button>
          </Box>
        </Box>
      </Modal>
    );
  };

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };
  export default DeleteModule;