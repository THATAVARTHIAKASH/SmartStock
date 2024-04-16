import { useState, useEffect } from "react";
import { useHistory, useLocation, Link as RouterLink } from "react-router-dom";
import React  from 'react';
import logo from './logo.png';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import LoadingButton from "@mui/lab/LoadingButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import GoogleIcon from "@mui/icons-material/Google";
import Divider from "@mui/material/Divider";
import { useAuth } from "../Context/MyContext";

const Signup = () => {
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const { currentUser, signupWithEmail, signInWithGoogle } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (currentUser.uid) {
      history.replace(from);
    }
  }, [currentUser, from, history]);
  const handleInput = ({ target }) => {
    setValues({ ...values, [target.name]: target.value });
  };
  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleSignup = async () => {
    try {
      setSignupError("");
      setLoading(true);
      if (values.password !== values.confirmPassword || values.password.length < 6) {
        throw new Error("Passwords do not match or password is less than 6 characters");
      }
      await signupWithEmail(values.email, values.password);
    } catch (error) {
      setSignupError(error.message);
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setSignupError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setSignupError(error.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <img
        src={logo} alt="logo"
        height={300}
        width={1100}
        style={{ alignSelf: 'center' }}
      />
      <Box justifyContent="center" alignItems="center" display="flex">
        <Box width={"100%"} maxWidth={600}>
          <Box m={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="email">EMAIL</InputLabel>
              <OutlinedInput
                id="email"
                label="Email"
                value={values.email}
                name="email"
                onChange={handleInput}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box mx={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="password" error={signupError.length > 0}>
                PASSWORD
              </InputLabel>
              <OutlinedInput
                error={signupError.length > 0}
                id="password"
                label="Password"
                value={values.password}
                name="password"
                onChange={handleInput}
                type={values.showPassword ? "text" : "password"}
                autoComplete="current-password"
                startAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="start">
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {signupError.length > 0 && <FormHelperText error>{signupError}</FormHelperText>}
            </FormControl>
          </Box>
          <Box mx={4} mt={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="confirmPassword" error={signupError.length > 0}>
                CONFIRM PASSWORD
              </InputLabel>
              <OutlinedInput
                error={signupError.length > 0}
                id="confirmPassword"
                label="confirmPassword"
                value={values.confirmPassword}
                name="confirmPassword"
                onChange={handleInput}
                type={values.showPassword ? "text" : "password"}
                autoComplete="current-password"
                startAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="start">
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {signupError.length > 0 && <FormHelperText error>{signupError}</FormHelperText>}
            </FormControl>
          </Box>
          <Box
            mx={4}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <Link to="/login" component={RouterLink} underline="none">
              <Typography variant="subtitle2">Already have an account? Login </Typography>
            </Link>
          </Box>
          <Box m={4}>
            <LoadingButton
              onClick={handleSignup}
              loading={loading || !currentUser.initialized}
              loadingIndicator="Loading..."
              variant="contained"
              fullWidth>
              Signup
            </LoadingButton>
          </Box>
          <Divider />
          <Box m={4}>
            <LoadingButton
              loading={loading || !currentUser.initialized}
              loadingIndicator="Loading..."
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              color="primary">
              Login with Google
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
