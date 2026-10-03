// Import React
// React is needed to create and run the React application
import React from 'react';

// Import ReactDOM
// ReactDOM connects the React application to the HTML page
import ReactDOM from 'react-dom/client';

// Import Toastify CSS
// This provides the styling for toast notifications
import "react-toastify/dist/ReactToastify.css";

// Import global CSS for the React application
import './index.css';

// Import the main App component
// App.js contains the main routing and application structure
import App from './App';

// Import ThemeProvider
// ThemeProvider provides theme information to the components
// such as light/dark theme, depending on how ThemeContext is implemented
import { ThemeProvider } from "./context/ThemeContext";

// Import the function used for measuring React application performance
import reportWebVitals from './reportWebVitals';


// Find the HTML element with id="root"
// React will render the entire application inside this element
const root = ReactDOM.createRoot(document.getElementById('root'));


// Render the React application
root.render(

  // StrictMode helps identify potential problems during development
  // It does not create the actual UI by itself
  <React.StrictMode>

    {/* ThemeProvider makes the theme context available to App and its child components */}
    <ThemeProvider>

      {/* App is the main component of our React application */}
      <App />

    </ThemeProvider>

  </React.StrictMode>
);


// Measure application performance
// reportWebVitals can be used to measure things such as
// loading and rendering performance
reportWebVitals();