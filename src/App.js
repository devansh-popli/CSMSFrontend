import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CarEntry } from "./Pages/CarEntry";
import AppNavbar from "./Components/AppNavbar";
import CustomerManagement from "./Pages/CustomerManagement";
import NewCustomerForm from "./Pages/NewCustomerForm";
import ServiceHistory from "./Pages/ServiceHistory";
import { ToastContainer, Zoom } from "react-toastify";
import ServiceRequest from "./Pages/ServiceRequest";

function App() {
  return (
    <>
      <BrowserRouter>
      <ToastContainer
              draggable
              transition={Zoom}
              position="bottom-center"
            />
        <AppNavbar />
        <Routes>
          <Route path="/car-entry/:id" element={<CarEntry />} />
          <Route path="/customer-details" element={<CustomerManagement />} />
          <Route path="/new-customer" element={<NewCustomerForm />} />
          <Route path="/service-history/:id" element={<ServiceHistory/>} />
          <Route path="/service-request" element={<ServiceRequest/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
