import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosRequestConfig } from "axios";
import { cx, css } from "@emotion/css";
import {useSelector} from 'react-redux';
import { Formik } from "formik";
import { DataGrid } from "@mui/x-data-grid";
import {useNavigate} from 'react-router-dom';

interface User {
  firstName: String;
  lastName: String;
  nationalCode: Number;
  phoneNumber: Number;
}

function TestProject() {
  const navigate = useNavigate();
  const userAuthenticated = useSelector((state:any)=>state.userAuth);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [userTableData, setUserTableData] = useState<Array<User>>([]);
  const [tableHeader, setTableHeader] = useState([]);
  const classes = {
    containerClass: css`
      display: flex;
      flex-directon: row;
      margin-top: 70px;
    `,
    formStyle: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding-left: 10px;
    `,
  };
  const fetchTableData = async () => {
    const { data, status } = await axios.get("http://localhost:5000/tableList");
    if (status === 200) {
      const columnArray: any = [];
      setUserTableData(data);
      for (let j in Object.keys(data[0])) {
        columnArray.push({
          field: Object.keys(data[0])[j],
          headerName: Object.keys(data[0])[j],
        });
      }
      columnArray.push({
        field: "delete",
        headerName: "delete",
        sortable: false,
        renderCell: (params) => {
          const onClick = async (e) => {
            e.stopPropagation(); // don't select this row after clicking
            const api: any = params.api;
            const thisRow: any = {};

            api
              .getAllColumns()
              .filter((c) => c.field !== "__check__" && !!c)
              .forEach(
                (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
              );
            const response = await axios.delete(
              `http://localhost:5000/tableList/${thisRow.id}`
            );
            setUserTableData((prevState) =>
              prevState.filter(
                (state) => state.phoneNumber !== thisRow.phoneNumber
              )
            );
          };

          return (
            <Button variant="contained" color="secondary" onClick={onClick}>
              delete
            </Button>
          );
        },
      });
      setTableHeader(columnArray);
      setUserTableData(data);
    }
  };
  const checkAuth=()=>{
    if(!userAuthenticated.isAuth){
      navigate('/login');
    }
  }
  useEffect(() => {
    checkAuth();
    fetchTableData();
  }, []);

  return (
    <Box className={cx(classes.containerClass)}>
      <Box
        style={{
          width: "50vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            nationalCode: 0,
            phoneNumber: 0,
          }}
          validate={(values: User) => {
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
            if (
              !errors.firstName &&
              !errors.lastName &&
              !errors.phoneNumber &&
              !errors.nationalCode &&
              !errors.phoneNumber &&
              !errors.password
            ) {
              setIsDisabled(false);
            }
            return errors;
          }}
          onSubmit={async (values) => {
            const { data, status } = await axios.post(
              "http://localhost:5000/tableList",
              values
            );
            if (status === 201) {
              setUserTableData((prevState) => [...prevState, data]);
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
                value={values.firstName}
                style={{ width: "350px", marginBottom: "8px" }}
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
                style={{ width: "350px", marginBottom: "8px" }}
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
                label="Phone Number"
                style={{ width: "350px", marginBottom: "8px" }}
                name="phoneNumber"
                variant="outlined"
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
                label="National Code"
                name="nationalCode"
                style={{ width: "350px", marginBottom: "8px" }}
                variant="outlined"
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
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isDisabled}
              >
                submit
              </Button>
            </form>
          )}
        </Formik>
      </Box>
      <Box style={{ width: "50vw" }}>
        <Box style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={userTableData}
            columns={tableHeader}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default TestProject;
