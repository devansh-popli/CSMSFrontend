import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { saveVehicle } from '../Service/VehicleService';
import { toast } from 'react-toastify';

const VehicleRegistrationForm = ({id,handleClose,customers,setCustomers}) => {
  const [vehicleData, setVehicleData] = useState({
    regNo: '',
    carModel: '',
    chasisNo: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    saveVehicle({
        customer: { id: id },
        regNo: vehicleData.regNo,
        chasisNo: vehicleData.chasisNo,
        carModel: vehicleData.carModel,
      }).then((data) => {
         customers.find(customer=>customer.id==id).vehicles.push(data)
         setCustomers(customers)
        toast.success("vehicle details saved");
        handleClose()
      }).catch(()=>{
        toast.error("Internal Server Error or Maybe your Vehicle Details already exist")
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
        {/* {id} */}
      <h2>Vehicle Registration Form</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="regNo">
          <Form.Label>Registration Number</Form.Label>
          <Form.Control
            type="text"
            name="regNo"
            value={vehicleData.regNo}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="carModel">
          <Form.Label>Car Model</Form.Label>
          <Form.Control
            type="text"
            name="carModel"
            value={vehicleData.carModel}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="chasisNo">
          <Form.Label>Chassis Number</Form.Label>
          <Form.Control
            type="text"
            name="chasisNo"
            value={vehicleData.chasisNo}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button className='mt-3' variant="primary" type="submit">
          Register Vehicle
        </Button>
      </Form>
    </div>
  );
};

export default VehicleRegistrationForm;
