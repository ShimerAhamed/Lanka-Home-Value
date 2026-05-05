// History.jsx displays saved prediction history from the Express backend.
import { useEffect, useState } from "react";

import api from "../services/api";

function formatLkr(value) {
  return Number(value || 0).toLocaleString("en-LK");
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  return new Date(dateValue).toLocaleString();
}

function getCategoryClass(category) {
  return `category-badge category-${String(category || "").toLowerCase()}`;
}

function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
    return "Backend is not running. Please start the Express backend first.";
  }

  return "Could not load prediction history.";
}

function History() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPredictions = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get("/predictions");
      setPredictions(response.data.data || []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const deletePrediction = async (id) => {
    const confirmDelete = window.confirm("Delete this prediction history record?");

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/predictions/${id}`);
      setPredictions((currentPredictions) =>
        currentPredictions.filter((prediction) => prediction._id !== id)
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Could not delete the prediction record. Please try again."
      );
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div className="heading-row">
          <div>
            <p className="eyebrow">MongoDB Records</p>
            <h1>Prediction History</h1>
            <p>View the latest saved house price predictions from the Express backend.</p>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={loadPredictions}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {isLoading && <div className="alert">Loading prediction history...</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {!isLoading && !errorMessage && predictions.length === 0 && (
        <div className="empty-state">No prediction history records found.</div>
      )}

      <div className="history-list">
        {predictions.map((prediction) => (
          <article className="history-card" key={prediction._id}>
            <div>
              <span className="metric-label">
                {prediction.inputData?.district || "Unknown District"}
              </span>
              <h2>{prediction.inputData?.area || "Unknown Area"}</h2>
              <p>{formatDate(prediction.createdAt)}</p>
            </div>

            <div className="history-price">
              <strong>LKR {formatLkr(prediction.predictedPriceLkr)}</strong>
              <span className={getCategoryClass(prediction.priceCategory)}>
                {prediction.priceCategory}
              </span>
            </div>

            <button
              className="secondary-button danger-button"
              type="button"
              onClick={() => deletePrediction(prediction._id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default History;
