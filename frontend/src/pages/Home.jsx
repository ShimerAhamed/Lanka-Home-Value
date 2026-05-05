// Home.jsx is the first page users see when they open the React app.
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home-grid">
      <div className="hero-panel">
        <p className="eyebrow">Final Year Machine Learning Project</p>
        <h1>LankaHomeValue</h1>
        <h2>AI-Based House Price Prediction System for Sri Lanka</h2>
        <p>
          This system helps estimate Sri Lankan house selling prices using a
          trained machine learning model. The React frontend sends house details
          to the Express backend, which connects to the FastAPI prediction API.
        </p>
        <Link to="/predict" className="primary-button">
          Predict House Price
        </Link>
      </div>

      <div className="summary-panel">
        <div>
          <span className="metric-label">Target</span>
          <strong>house_selling_price_lkr</strong>
        </div>
        <div>
          <span className="metric-label">Currency</span>
          <strong>Sri Lankan Rupees</strong>
        </div>
        <div>
          <span className="metric-label">Output</span>
          <strong>Price + Category</strong>
        </div>
      </div>
    </section>
  );
}

export default Home;
