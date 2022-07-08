import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import bcryptjs from 'bcryptjs';
import {useNavigate} from 'react-router-dom';
import { cx, css } from "@emotion/css";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from 'react-redux';
import {userLogedIn} from '../userAuthReducer'
import 'react-toastify/dist/ReactToastify.css';
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";


interface UserType {
  phoneNumber: Number;
  password: String;
}

function Login() {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const classes = {
    containerClass: css`
      margin-top:70px;
    `,
    formStyle:css`
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items: flex-start;
      padding-left: 10px;
    `,
    
  };

  return (
    <div className={cx(classes.containerClass)}>
       
      <Formik
        initialValues={{
          phoneNumber: 0,
          password: "",
        }}
        validate={(values:UserType) => {
          const errors: any = {};
          if (values.phoneNumber.toString().length !== 10) {
            errors.phoneNumber = "incorrect phone number";
          }
          if (values.password.length < 6) {
            errors.password = "password must be more than 6 digits";
          }
          if (
            !errors.phoneNumber &&
            !errors.password
          ) {
            setIsDisabled(false);
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const { status, data } = await axios.get(
            `http://localhost:5000/users?phoneNumber=${values.phoneNumber}`
          );
          if (data[0]) {
            const isPasswordCompared = await bcryptjs.compare(values.password,data[0].password);
            if(isPasswordCompared){
              navigate('/testProject');
              dispatch(userLogedIn());
            }else{
              toast.error('Wrong password');
            }
          }else{
            toast.error('Wrong UserName or Password');
          }
          }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}
          className={cx(classes.formStyle)}>
            <TextField
              type='number'
              label="Phone Number"
              name="phoneNumber"
              variant="outlined"
              size="small"
              style={{width:'250px',marginBottom:'8px'}}
              value={values.phoneNumber}
              onChange={handleChange}
            />
             {errors.phoneNumber && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{ color: "red" }}
                >
                  {errors.phoneNumber}
                </Typography>
              )}
            <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={isShowPassword ? "text" : "password"}
              name='password'
              size="small"
              style={{width:'250px',marginBottom:'8px'}}
              value={values.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errors.password && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{ color: "red" }}
                >
                  {errors.password}
                </Typography>
              )}
            </FormControl>
            <Button type="submit" color="primary" variant="contained" disabled={isDisabled}>
              submit
            </Button>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
}

export default Login;
