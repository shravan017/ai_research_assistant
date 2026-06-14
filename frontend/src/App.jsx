import React from "react"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Home from "./pages/Home";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            } 
          />
          <Route path="/workspace/:id" element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
            }
          />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
