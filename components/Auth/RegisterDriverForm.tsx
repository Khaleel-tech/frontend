"use client";
import { West } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Divider } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/utils/store/store";
import { sx } from "@/utils/constants";
import toast from "react-hot-toast";
import { registerDriver } from "@/utils/reducers/authReducers";
import { CircularProgressBar } from "../CustomLoader";

const validationSchema = yup.object().shape({
  name: yup.string().required("fullname is required"),
  mobile: yup.string().required("mobile is required"),
  email: yup
    .string()
    .email("invalid email")
    .required("email is required")
    .notOneOf(["ride@fast.com"], "You cannot pick this email"),
  password: yup
    .string()
    .min(8, "password should be of atleast 8 characters")
    .required("password is required"),
  licenseNumber: yup.string().required("license number is required"),
  licenseState: yup.string().required("license state is required"),
  licenseExpirationDate: yup
    .string()
    .required("license expiration date is required"),
  company: yup.string().required("company is required"),
  model: yup.string().required("model is required"),
  capacity: yup.string().required("capacity is required"),
  year: yup.string().required("year is required"),
  licensePlate: yup.string().required("vehicle number is required"),
});
function RegisterDriverForm() {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
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
      name: "",
      mobile: "",
      location: "",
      licenseNumber: "",
      licenseState: "",
      licenseExpirationDate: "",
      company: "",
      model: "",
      color: "",
      year: "",
      capacity: "",
      licensePlate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        email,
        password,
        mobile,
        name,
        licenseExpirationDate,
        licenseNumber,
        capacity,
        color,
        company,
        model,
        year,
        licensePlate,
        licenseState,
      } = values;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("error getting current location");
          toast.error("Error Getting current location");
          return;
        }
      );
      if (formik.isValid) {
        const driverData = {
          name: name,
          email: email,
          password: password,
          mobile: mobile,
          latitude: location.latitude,
          longitude: location.longitude,
          license: {
            licenseNumber: parseInt(licenseNumber),
            licenseExpirationDate: licenseExpirationDate,
            licenseState: licenseState,
          },
          vehicle: {
            company: company,
            model: model,
            year: year,
            color: color,
            capacity: capacity,
            licensePlate: licensePlate,
          },
        };
        try {
          const response = await dispatch(registerDriver(driverData));
          // registerUser({ name,email, password, mobile, })
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
          toast.error("An error occured while registering");
        }
      }
    },
  });

  return (
    <Box className="h-full bg-[#F8F9FA] max-h-screen overflow-y-auto">
      <Box className="flex items-center px-4 lg:px-8 py-4 sticky top-0 z-10 bg-[#F8F9FA]">
        <West 
          className="cursor-pointer text-[#007BFF]" 
          onClick={goBack} 
        />
        <Typography 
          variant="h5" 
          className="w-full text-center font-sans font-bold tracking-wider text-[#333]"
        >
          DRIVER REGISTRATION
        </Typography>
      </Box>
      
      <Box className="flex flex-col justify-center items-center py-4">
        <Paper 
          elevation={0} 
          className="w-[95%] sm:w-[85%] lg:w-[90%] p-5 rounded-lg bg-white"
          sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" className="text-center font-semibold text-[#007BFF] mb-4">
              Driver Details
            </Typography>
            
            <TextField
              label="Name"
              name="name"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" className="text-center font-semibold text-[#007BFF] my-3">
              Driving License Details
            </Typography>
            
            <TextField
              label="Driving License Number"
              name="licenseNumber"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="AB245"
              value={formik.values.licenseNumber}
              onChange={formik.handleChange}
              error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
              helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
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
              label="License State"
              name="licenseState"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="London"
              value={formik.values.licenseState}
              onChange={formik.handleChange}
              error={formik.touched.licenseState && Boolean(formik.errors.licenseState)}
              helperText={formik.touched.licenseState && formik.errors.licenseState}
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
              label="License Expiration Date"
              name="licenseExpirationDate"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formik.values.licenseExpirationDate}
              onChange={formik.handleChange}
              error={formik.touched.licenseExpirationDate && Boolean(formik.errors.licenseExpirationDate)}
              helperText={formik.touched.licenseExpirationDate && formik.errors.licenseExpirationDate}
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
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" className="text-center font-semibold text-[#007BFF] my-3">
              Vehicle Details
            </Typography>
            
            <TextField
              label="Vehicle Company"
              name="company"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Toyota"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
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
              label="Model"
              name="model"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="SUV300"
              value={formik.values.model}
              onChange={formik.handleChange}
              error={formik.touched.model && Boolean(formik.errors.model)}
              helperText={formik.touched.model && formik.errors.model}
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

            <Box className="flex gap-2 mb-3">
              <TextField
                label="Color"
                name="color"
                type="text"
                variant="outlined"
                fullWidth
                placeholder="Red"
                margin="normal"
                value={formik.values.color}
                onChange={formik.handleChange}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
                sx={{ 
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
                label="Year"
                name="year"
                type="number"
                variant="outlined"
                fullWidth
                placeholder="2010"
                margin="normal"
                value={formik.values.year}
                onChange={formik.handleChange}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
                sx={{ 
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
                label="Capacity"
                name="capacity"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="12"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
                sx={{ 
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
            </Box>
            
            <TextField
              label="Vehicle Plate Number"
              name="licensePlate"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="hdj2354f"
              value={formik.values.licensePlate}
              onChange={formik.handleChange}
              error={formik.touched.licensePlate && Boolean(formik.errors.licensePlate)}
              helperText={formik.touched.licensePlate && formik.errors.licensePlate}
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
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 8px rgba(0,123,255,0.2)',
                '&:hover': {
                  backgroundColor: '#0069d9'
                },
                mb: 2
              }}
            >
              {isLoading ? <CircularProgressBar /> : "Create Driver Account"}
            </Button>
          </form>
        </Paper>

        <Box className="flex flex-col w-full justify-center items-center mt-4">
          <Typography className="flex items-center text-center text-[#6c757d] mt-4 font-sans">
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

export default RegisterDriverForm;
