// Predict.jsx contains the house price prediction form and result display.
import { useState } from "react";

import api from "../services/api";

const initialFormData = {
  district: "Colombo",
  area: "",
  perch: "",
  bedrooms: "",
  bathrooms: "",
  kitchen_area_sqft: "",
  parking_spots: "",
  has_garden: "No",
  has_ac: "No",
  water_supply: "Yes",
  electricity: "Yes",
  floors: "",
  year_built: "",
  nearest_city: "",
  property_type: "House",
  house_size_sqft: "",
  house_age: "",
  condition: "Good",
  furnishing_status: "Semi Furnished",
  road_access_width_ft: "",
  distance_to_main_road_km: "",
  distance_to_town_km: "",
  has_boundary_wall: "No",
  has_servant_room: "No",
  has_hot_water: "No",
  has_security: "No",
  roof_type: "Tile",
  floor_type: "Tile",
  listed_year: new Date().getFullYear(),
  bathroom_bedroom_ratio: "",
  luxury_score: "",
  location_category: "Urban",
};

const currentYear = new Date().getFullYear();

const numericFields = [
  "perch",
  "bedrooms",
  "bathrooms",
  "kitchen_area_sqft",
  "parking_spots",
  "floors",
  "year_built",
  "house_size_sqft",
  "house_age",
  "road_access_width_ft",
  "distance_to_main_road_km",
  "distance_to_town_km",
  "listed_year",
  "bathroom_bedroom_ratio",
  "luxury_score",
];

const requiredFields = Object.keys(initialFormData);

const fieldLabels = {
  district: "District",
  area: "Area",
  perch: "Land Size",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  kitchen_area_sqft: "Kitchen Area",
  parking_spots: "Parking Spots",
  has_garden: "Has Garden",
  has_ac: "Has AC",
  water_supply: "Water Supply",
  electricity: "Electricity",
  floors: "Floors",
  year_built: "Year Built",
  nearest_city: "Nearest City",
  property_type: "Property Type",
  house_size_sqft: "House Size",
  house_age: "House Age",
  condition: "Condition",
  furnishing_status: "Furnishing Status",
  road_access_width_ft: "Road Access Width",
  distance_to_main_road_km: "Distance to Main Road",
  distance_to_town_km: "Distance to Town",
  has_boundary_wall: "Has Boundary Wall",
  has_servant_room: "Has Servant Room",
  has_hot_water: "Has Hot Water",
  has_security: "Has Security",
  roof_type: "Roof Type",
  floor_type: "Floor Type",
  listed_year: "Listed Year",
  bathroom_bedroom_ratio: "Bathroom Bedroom Ratio",
  luxury_score: "Luxury Score",
  location_category: "Location Category",
};

const nonNegativeFields = [
  "bedrooms",
  "bathrooms",
  "floors",
  "parking_spots",
  "distance_to_main_road_km",
  "distance_to_town_km",
  "house_age",
  "luxury_score",
];

const positiveFields = numericFields.filter(
  (fieldName) =>
    !nonNegativeFields.includes(fieldName) &&
    fieldName !== "year_built" &&
    fieldName !== "listed_year"
);

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Matara",
  "Kurunegala",
  "Anuradhapura",
  "Jaffna",
  "Ratnapura",
];

function formatLkr(value) {
  return Number(value || 0).toLocaleString("en-LK");
}

function getCategoryClass(category) {
  return `category-badge category-${String(category || "").toLowerCase()}`;
}

function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
    return "Backend is not running. Please start the Express backend first.";
  }

  return "Prediction failed. Please check the form values and try again.";
}

function Predict() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const validateForm = () => {
    const errors = {};

    requiredFields.forEach((fieldName) => {
      const value = formData[fieldName];

      if (value === "" || value === null || value === undefined) {
        errors[fieldName] = `${fieldLabels[fieldName]} is required.`;
      }
    });

    numericFields.forEach((fieldName) => {
      const value = formData[fieldName];

      if (value === "" || value === null || value === undefined) {
        return;
      }

      const numberValue = Number(value);

      if (Number.isNaN(numberValue)) {
        errors[fieldName] = `${fieldLabels[fieldName]} must be a valid number.`;
        return;
      }

      if (positiveFields.includes(fieldName) && numberValue <= 0) {
        errors[fieldName] = `${fieldLabels[fieldName]} must be greater than 0.`;
      }

      if (nonNegativeFields.includes(fieldName) && numberValue < 0) {
        errors[fieldName] = `${fieldLabels[fieldName]} must not be negative.`;
      }
    });

    const yearBuilt = Number(formData.year_built);
    if (!Number.isNaN(yearBuilt) && (yearBuilt < 1900 || yearBuilt > currentYear)) {
      errors.year_built = `Year Built must be between 1900 and ${currentYear}.`;
    }

    const listedYear = Number(formData.listed_year);
    if (!Number.isNaN(listedYear) && (listedYear < 2000 || listedYear > currentYear)) {
      errors.listed_year = `Listed Year must be between 2000 and ${currentYear}.`;
    }

    return errors;
  };

  const preparePayload = () => {
    const payload = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (numericFields.includes(key)) {
        payload[key] = value === "" ? null : Number(value);
      } else {
        payload[key] = value;
      }
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setErrorMessage("");
    setFieldErrors({});

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage("Please fix the highlighted form fields before predicting.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/predict", preparePayload());
      setResult(response.data.data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (name, label, type = "text") => (
    <label className={`form-field ${fieldErrors[name] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={label}
        step={type === "number" ? "any" : undefined}
        min={type === "number" && name !== "year_built" && name !== "listed_year" ? "0" : undefined}
        max={name === "year_built" || name === "listed_year" ? currentYear : undefined}
        required
      />
      {fieldErrors[name] && <small>{fieldErrors[name]}</small>}
    </label>
  );

  const renderSelect = (name, label, options) => (
    <label className={`form-field ${fieldErrors[name] ? "has-error" : ""}`}>
      <span>{label}</span>
      <select name={name} value={formData[name]} onChange={handleChange} required>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {fieldErrors[name] && <small>{fieldErrors[name]}</small>}
    </label>
  );

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Prediction Form</p>
        <h1>Predict House Selling Price</h1>
        <p>Enter house details and submit the form to get an estimated price.</p>
      </div>

      <form className="prediction-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Location Details</h2>
          <div className="form-grid">
            {renderSelect("district", "District", districts)}
            {renderInput("area", "Area")}
            {renderInput("nearest_city", "Nearest City")}
            {renderSelect("location_category", "Location Category", [
              "Urban",
              "Suburban",
              "Rural",
            ])}
            {renderInput("distance_to_main_road_km", "Distance to Main Road (km)", "number")}
            {renderInput("distance_to_town_km", "Distance to Town (km)", "number")}
          </div>
        </div>

        <div className="form-section">
          <h2>Property Details</h2>
          <div className="form-grid">
            {renderSelect("property_type", "Property Type", [
              "House",
              "Villa",
              "Bungalow",
              "Annex",
            ])}
            {renderInput("perch", "Land Size (Perches)", "number")}
            {renderInput("house_size_sqft", "House Size (sqft)", "number")}
            {renderInput("bedrooms", "Bedrooms", "number")}
            {renderInput("bathrooms", "Bathrooms", "number")}
            {renderInput("bathroom_bedroom_ratio", "Bathroom Bedroom Ratio", "number")}
            {renderInput("kitchen_area_sqft", "Kitchen Area (sqft)", "number")}
            {renderInput("floors", "Floors", "number")}
            {renderInput("parking_spots", "Parking Spots", "number")}
            {renderInput("road_access_width_ft", "Road Access Width (ft)", "number")}
          </div>
        </div>

        <div className="form-section">
          <h2>Condition and Facilities</h2>
          <div className="form-grid">
            {renderSelect("condition", "Condition", [
              "Excellent",
              "Good",
              "Average",
              "Needs Renovation",
            ])}
            {renderSelect("furnishing_status", "Furnishing Status", [
              "Fully Furnished",
              "Semi Furnished",
              "Unfurnished",
            ])}
            {renderSelect("roof_type", "Roof Type", ["Tile", "Asbestos", "Concrete", "Other"])}
            {renderSelect("floor_type", "Floor Type", ["Tile", "Cement", "Wood", "Terrazzo"])}
            {renderInput("year_built", "Year Built", "number")}
            {renderInput("house_age", "House Age", "number")}
            {renderInput("listed_year", "Listed Year", "number")}
            {renderInput("luxury_score", "Luxury Score", "number")}
          </div>
        </div>

        <div className="form-section">
          <h2>Yes or No Features</h2>
          <div className="form-grid">
            {renderSelect("has_garden", "Has Garden", ["Yes", "No"])}
            {renderSelect("has_ac", "Has AC", ["Yes", "No"])}
            {renderSelect("water_supply", "Water Supply", ["Yes", "No"])}
            {renderSelect("electricity", "Electricity", ["Yes", "No"])}
            {renderSelect("has_boundary_wall", "Has Boundary Wall", ["Yes", "No"])}
            {renderSelect("has_servant_room", "Has Servant Room", ["Yes", "No"])}
            {renderSelect("has_hot_water", "Has Hot Water", ["Yes", "No"])}
            {renderSelect("has_security", "Has Security", ["Yes", "No"])}
          </div>
        </div>

        <button className="primary-button form-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Predicting..." : "Predict Price"}
        </button>
      </form>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {result && (
        <div className="result-card">
          <span className="metric-label">Prediction Result</span>
          <h2>Predicted House Selling Price: LKR {formatLkr(result.predicted_price_lkr)}</h2>
          <p>
            Price Category:{" "}
            <span className={getCategoryClass(result.price_category)}>
              {result.price_category}
            </span>
          </p>
          <div className="disclaimer">
            This is an estimated value generated by a machine learning model and is not an
            official property valuation.
          </div>
        </div>
      )}
    </section>
  );
}

export default Predict;
