"use client";
import { sx } from "@/utils/constants";
import {
  driverProfile,
  loginUser,
  userProfile,
} from "@/utils/reducers/authReducers";
import { useAppDispatch, useAppSelector } from "@/utils/store/store";
import { West } from "@mui/icons-material";
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { CircularProgressBar } from "../CustomLoader";

const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("email is required"),
  password: yup.string().required("password is required"),
  role: yup.string().oneOf(["DRIVER", "NORMAL_USER"]),
});
function LoginForm() {
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
      role: "NORMAL_USER",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, password, role } = values;
      if (formik.isValid) {
        try {
          const response = await dispatch(loginUser({ email, password, role }));
          if (response.payload.error) {
            toast.error(response.payload.message);
          } else if (response.payload === "Internal Server Error") {
            toast.error(response.payload);
          } else {
            toast.success(response.payload.message);
          }
        } catch (error) {
          toast.error("An error occurred while logging in");
        }
      }
    },
  });

  const auth = useAppSelector((store) => store.auth);
  useEffect(() => {
    const checkAuthorized = async () => {
      try {
        let response = null;
        if (auth.role && auth.token) {
          if (auth.role === "DRIVER") {
            response = await dispatch(driverProfile(auth.token));
            if (response.payload?.code !== 401) {
              router.replace("/driver/dashboard");
            }
          } else if (auth.role === "NORMAL_USER") {
            dispatch(userProfile(auth.token)).then((response) => {
              if (response.payload.email === "ride@fast.com") {
                router.replace("/company");
              } else if (response.payload?.code !== 401) {
                router.replace("/bookRide");
              }
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkAuthorized();
  }, [auth.token, auth.role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Your next ride is just a login away</p>
          </div>

          <form onSubmit={formik.handleSubmit} method="POST" className="space-y-6">
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="john@email.com"
              variant="outlined"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4f46e5',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4f46e5',
                },
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="**********"
              variant="outlined"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4f46e5',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4f46e5',
                },
              }}
            />

            <FormControl component="fieldset" fullWidth>
              <FormLabel 
                component="legend" 
                sx={{ 
                  color: '#4f46e5', 
                  '&.Mui-focused': { 
                    color: '#4f46e5' 
                  },
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}
              >
                I want to
              </FormLabel>
              <RadioGroup
                row
                aria-label="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                sx={{ 
                  justifyContent: 'center',
                  gap: '2rem',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                }}
              >
                <FormControlLabel
                  value="NORMAL_USER"
                  control={
                    <Radio 
                      sx={{ 
                        color: '#6366f1',
                        '&.Mui-checked': {
                          color: '#4f46e5',
                        },
                      }} 
                    />
                  }
                  label="Book a Ride"
                />
                <FormControlLabel
                  value="DRIVER"
                  control={
                    <Radio 
                      sx={{ 
                        color: '#6366f1',
                        '&.Mui-checked': {
                          color: '#4f46e5',
                        },
                      }} 
                    />
                  }
                  label="Drive"
                />
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                py: 2,
                mt: 2,
                backgroundColor: '#4f46e5',
                backgroundImage: 'linear-gradient(to right, #4f46e5, #6366f1)',
                '&:hover': {
                  backgroundColor: '#4338ca',
                  backgroundImage: 'linear-gradient(to right, #4338ca, #4f46e5)',
                },
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              {isLoading ? <CircularProgressBar /> : "Sign In"}
            </Button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Button
              onClick={() => router.push("/register")}
              sx={{
                color: '#4f46e5',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#4338ca',
                },
              }}
            >
              Register
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
