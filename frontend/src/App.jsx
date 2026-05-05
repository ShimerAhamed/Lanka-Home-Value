// App.jsx contains the main layout, navigation, and page routes.
import { NavLink, Route, Routes } from "react-router-dom";

import About from "./pages/About.jsx";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";
import Predict from "./pages/Predict.jsx";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          LankaHomeValue
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/predict">Predict House Price</NavLink>
          <NavLink to="/history">Prediction History</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
