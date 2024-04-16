import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import React  from 'react';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../Context/MyContext";

const ForgotPassword = () => {
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const { currentUser, sendResetEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (currentUser.uid) {
      history.replace(from);
    }
  }, [currentUser, from, history]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await sendResetEmail(email);
      setMailSent(true);
      setTimeout(() => {
        history.replace("/login");
      }, 1000);
    } catch (error) {
      setLoading(false);
      setEmailError(error.message);
    }
  };
  return (
    <Container>
      <Typography variant="h4">Forgot Password</Typography>
      <Box mx={4}>
        <Typography variant="body1">
          Enter your email address and we will send you a link to reset your
          password.
        </Typography>
      </Box>
      <Box justifyContent="center" alignItems="center" display="flex">
        <Box width={"100%"} maxWidth={600}>
          <Box mx={4} my={2}>
            {mailSent && (
              <Alert severity="success">
                Mail sent successfully. Redirecting to Login
              </Alert>
            )}
          </Box>
          <Box m={4}>
            <FormControl fullWidth error={emailError.length > 0}>
              <InputLabel htmlFor="email">EMAIL</InputLabel>
              <OutlinedInput
                id="email"
                label="Email"
                value={email}
                name="email"
                onChange={handleEmailChange}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                }
              />
              <FormHelperText error>{emailError}</FormHelperText>
            </FormControl>
          </Box>
          <Box m={4}>
            <LoadingButton
              onClick={handleSubmit}
              loading={loading || !currentUser.initialized}
              loadingIndicator="Sending..."
              variant="contained"
              fullWidth
            >
              Send Reset Email
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
