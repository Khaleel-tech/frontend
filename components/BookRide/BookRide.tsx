"use client";
import React, { useState } from "react";
import { debounce } from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";
import BookRideNavBar from "./BookRideNavBar";
import { Button } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import AvailableCab from "./AvailableCabs";
import SearchResult from "./SearchResult";
import axios from "axios";
import { requestRide } from "@/utils/reducers/rideReducers";
import { useAppDispatch, useAppSelector } from "@/utils/store/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CircularProgressBar } from "../CustomLoader";  // Add this import

const validationSchema = Yup.object().shape({
  pickupArea: Yup.string().required("Pickup location is required"),
  destinationArea: Yup.string().required("Destination location is required"),
});

function BookRide() {
  const [activeField, setActiveField] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useAppDispatch();
  const ride = useAppSelector((state) => state.ride);
  const isLoading = useAppSelector((state) => state.ride.isLoading);
  const router = useRouter();
  const fetchSuggestions = debounce(
    async (input: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/autocomplete.php?limit=5&key=pk.1dca78a113a7c45533e83e6c9f2196ae&q=${input}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    },
    500
  );

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value); // Update formik values
    setActiveField(name); // Set active field
    fetchSuggestions(value); // Fetch suggestions from API
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const displayName = suggestion.display_name;
    const latitude = suggestion.lat;
    const longitude = suggestion.lon;
    formik.setFieldValue(activeField, displayName);

    // Set latitude and longitude in the formik values
    if (activeField === "pickupArea") {
      formik.setFieldValue("pickupLatitude", latitude);
      formik.setFieldValue("pickupLongitude", longitude);
    } else if (activeField === "destinationArea") {
      formik.setFieldValue("destinationLatitude", latitude);
      formik.setFieldValue("destinationLongitude", longitude);
    }

    setActiveField("");
    setSuggestions([]);
  };

  const handleOnSubmit = async (values: {
    pickupArea: string;
    destinationArea: string;
    destinationLatitude: string;
    destinationLongitude: string;
    pickupLatitude: string;
    pickupLongitude: string;
  }) => {
    try {
      const response = await dispatch(
        requestRide({
          destinationArea: values.destinationArea,
          pickupArea: values.pickupArea,
          destinationLatitude: parseFloat(values.destinationLatitude),
          destinationLongitude: parseFloat(values.destinationLongitude),
          pickupLatitude: parseFloat(values.pickupLatitude),
          pickupLongitude: parseFloat(values.pickupLongitude),
        })
      );
      if (response.payload.code === 401) {
        router.replace("/login");
        return;
      }
      if (response.payload.error) {
        toast.error(response.payload.message);
      } else if (response.payload === "Internal Server Error") {
        toast.error(response.payload);
      } else {
        toast.success(response.payload.message || "Ride Booked successfully");
        router.push(`/rideDetail/${response.payload?.id}`);
      }
    } catch (error) {
      toast.error("An error occurred while Booking Ride");
    }
  };

  const formik = useFormik({
    initialValues: {
      pickupArea: "",
      pickupLatitude: "",
      pickupLongitude: "",
      destinationArea: "",
      destinationLatitude: "",
      destinationLongitude: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (formik.isValid) handleOnSubmit(values);
    },
  });
  const onFocused = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setActiveField(name);
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BookRideNavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Where would you like to go?</h1>
          
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 ml-4 mt-12 mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="relative border rounded-xl p-4 flex items-center bg-white hover:border-blue-500 transition-colors">
                    <div className="absolute left-4 w-3 h-3 rounded-full bg-blue-500"></div>
                    <input
                      type="text"
                      name="pickupArea"
                      placeholder="Enter pickup location"
                      className="w-full pl-8 outline-none bg-transparent"
                      value={formik.values.pickupArea}
                      onChange={handleInputChange}
                      onBlur={formik.handleBlur}
                      onFocus={onFocused}
                    />
                  </div>
                  {formik.touched.pickupArea && formik.errors.pickupArea && (
                    <p className="text-sm text-red-500 mt-1 ml-4">{formik.errors.pickupArea}</p>
                  )}
                </div>

                <div>
                  <div className="relative border rounded-xl p-4 flex items-center bg-white hover:border-blue-500 transition-colors">
                    <div className="absolute left-4 w-3 h-3 rounded-full bg-red-500"></div>
                    <input
                      type="text"
                      name="destinationArea"
                      placeholder="Enter destination"
                      className="w-full pl-8 outline-none bg-transparent"
                      value={formik.values.destinationArea}
                      onChange={handleInputChange}
                      onBlur={formik.handleBlur}
                      onFocus={onFocused}
                    />
                  </div>
                  {formik.touched.destinationArea && formik.errors.destinationArea && (
                    <p className="text-sm text-red-500 mt-1 ml-4">{formik.errors.destinationArea}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Suggestions */}
            {activeField && (activeField === "pickupArea" ? formik.values.pickupArea : formik.values.destinationArea).length > 0 && (
              <div className="absolute left-0 right-0 bg-white rounded-lg shadow-xl z-20 max-h-[300px] overflow-y-auto">
                {suggestions.map((suggestion: any, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <LocationOn className="text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {suggestion?.display_name.split(",")[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {suggestion?.display_name.split(",").slice(1).join(",")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-[1.02]"
              type="submit"
              variant="contained"
            >
              {isLoading ? <CircularProgressBar /> : "Find a ride"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookRide;
