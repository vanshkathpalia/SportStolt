import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { ThemeProvider } from './context/ThemeProvider.tsx'
import { AuthProvider } from './context/AuthContext';
// import { applyThemeFromPreference } from './utils/theme';

// applyThemeFromPreference(); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        {/* <BrowserRouter> */}
          <App />
        {/* </BrowserRouter> */}
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)

// // import { applyThemeFromPreference } from "./utils/theme";
// // applyThemeFromPreference(); 

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// // import { Provider } from "react-redux"
// import "./index.css"
// import App from './App.tsx'
// // import { store } from './store/store.ts'
// import { ThemeProvider } from "./components/theme-provider";
// // import { BrowserRouter } from "react-router-dom";

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ThemeProvider>
//       {/* <BrowserRouter> */}
//         <App />
//       {/* </BrowserRouter> */}
//     </ThemeProvider>
//   </StrictMode>
// )
