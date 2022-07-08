import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import bcryptjs from "bcryptjs";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { cx, css } from "@emotion/css";


interface SignedInUser {
  firstName: String;
  lastName: String;
  nationalCode: Number;
  phoneNumber: Number;
  password: String;
}



function SignIn() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const navigate = useNavigate();
  const classes = {
    containerClass: css`
      margin-top:70px;
    `,
    formStyle: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding-left: 10px;
    `,
  };

  return (
    <div className={cx(classes.containerClass)}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          nationalCode:0,
          phoneNumber:0,
          password: "",
        }}
        validate={(values:SignedInUser) => {
          const errors: any = {};
          if (!values.firstName) {
            errors.firstName = "firstName is Required";
          }
          if (!values.lastName) {
            errors.lastName = "lastName is Required";
          }
          if (values.nationalCode.toString().length !== 10) {
            errors.nationalCode = "nationalCode must be 10 digits";
          }
          if (values.phoneNumber.toString().length !== 10) {
            errors.phoneNumber = "incorrect phone number";
          }
          if (values.password.length < 6) {
            errors.password = "password must be more than 6 digits";
          }
          if(!errors.firstName &&!errors.lastName&&!errors.phoneNumber&&!errors.nationalCode&& !errors.phoneNumber && !errors.password){
            setIsDisabled(false)
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const password: any = values.password;
          const hashedPassword = await bcryptjs.hash(password, 8);
          const userData:SignedInUser = { ...values, password: hashedPassword };
          const { status } = await axios.post(
            "http://localhost:5000/users",
            userData
          );
          if (status === 201) {
            navigate("./login");
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
          <form onSubmit={handleSubmit} className={cx(classes.formStyle)}>
            <TextField
                label="First Name"
                name="firstName"
                variant="outlined"
                size="small"
                style={{width:'250px',marginBottom:'8px'}}
                value={values.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{ color: "red" }}
                >
                  {errors.firstName}
                </Typography>
              )}
              <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                size="small"
                style={{width:'250px',marginBottom:'8px'}}
                value={values.lastName}
                onChange={handleChange}
              />
              {errors.lastName?.length && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{ color: "red" }}
                >
                  {errors.lastName}
                </Typography>
              )}
              <TextField
                type='number'
                label="Phone Number"
                name="phoneNumber"
                variant="outlined"
                style={{width:'250px',marginBottom:'8px'}}
                size="small"
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
              <TextField
                type='number'
                label="National Code"
                name="nationalCode"
                variant="outlined"  
                style={{width:'250px',marginBottom:'8px'}}
                size="small"
                value={values.nationalCode}
                onChange={handleChange}
              />
              {errors.nationalCode && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{ color: "red" }}
                >
                  {errors.nationalCode}
                </Typography>
              )}

              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  size="small"
                  type={isShowPassword ? "text" : "password"}
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
              </FormControl>
              {errors.password && (
                <Typography
                  variant="caption"
                  display="block"
                  style={{ color: "red" }}
                >
                  {errors.password}
                </Typography>
              )}
            <Button type="submit" color="primary" variant="contained" disabled={isDisabled}>
              submit
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default SignIn;
