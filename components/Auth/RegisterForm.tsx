"use client";
import { West } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/utils/store/store";
import toast from "react-hot-toast";
import { registerUser } from "@/utils/reducers/authReducers";
import { CircularProgressBar } from "../CustomLoader";

const validationSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  mobile: yup.string().required("Mobile number is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .notOneOf(["ride@fast.com"], "You cannot use this email"),
  password: yup
    .string()
    .min(8, "Password should be at least 8 characters")
    .required("Password is required"),
});

function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  
  const goBack = () => {
    router.back();
  };
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      mobile: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, password, mobile, fullName } = values;
      if (formik.isValid) {
        try {
          const response = await dispatch(
            registerUser({ email, password, mobile, fullName })
          );
          if (response.payload.error) {
            toast.error(response.payload.message);
          } else if (response.payload === "Internal Server Error") {
            toast.error(response.payload);
          } else {
            toast.success(
              response.payload.message || "Registered Successfully"
            );
            router.push("/login");
          }
        } catch (error) {
          toast.error("An error occurred while registering");
        }
      }
    },
  });

  return (
    <Box className="h-full bg-[#F8F9FA]">
      <Box className="flex items-center px-4 lg:px-8 py-4">
        <West 
          className="cursor-pointer text-[#007BFF]" 
          onClick={goBack} 
        />
        <Typography 
          variant="h5" 
          className="w-full text-center font-sans font-bold tracking-wider text-[#333]"
        >
          CREATE ACCOUNT
        </Typography>
      </Box>
      
      <Box className="flex flex-col justify-center items-center py-6">
        <Paper 
          elevation={0} 
          className="w-[90%] sm:w-[80%] lg:w-[90%] p-6 rounded-lg bg-white"
          sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="John Doe"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover fieldset': {
                    borderColor: '#007BFF',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: '#007BFF !important',
                }
              }}
            />
            
            <TextField
              label="Mobile Number"
              name="mobile"
              type="tel"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="+91-0123456789"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover fieldset': {
                    borderColor: '#007BFF',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: '#007BFF !important',
                }
              }}
            />
            
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="john@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover fieldset': {
                    borderColor: '#007BFF',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: '#007BFF !important',
                }
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="**********"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover fieldset': {
                    borderColor: '#007BFF',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: '#007BFF !important',
                }
              }}
            />
            
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ 
                padding: "14px 0",
                backgroundColor: '#007BFF',
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 8px rgba(0,123,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#0069d9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0,123,255,0.3)'
                }
              }}
            >
              {isLoading ? <CircularProgressBar /> : "Create Account"}
            </Button>
          </form>
        </Paper>

        <Box className="flex flex-col w-full justify-center items-center mt-4">
          <Button
            variant="contained"
            fullWidth
            sx={{ 
              padding: "14px 0",
              backgroundColor: '#6c757d',
              color: '#ffffff',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              maxWidth: { xs: '90%', sm: '80%', lg: '90%' },
              boxShadow: '0 4px 8px rgba(108,117,125,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#5a6268',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(108,117,125,0.3)'
              }
            }}
            onClick={() => router.push("/driver/register")}
          >
            Register as a Driver
          </Button>
          
          <Typography className="flex items-center text-center text-[#6c757d] mt-6 font-sans">
            Already have an account?{" "}
            <Button
              sx={{ 
                fontWeight: 600,
                color: '#007BFF',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterForm;
