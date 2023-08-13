import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { saveCustomer } from '../Service/CustomerService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NewCustomerForm = () => {
  const navigate=useNavigate()
  const [customerData, setCustomerData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    pin: '',
    state: '',
    // code: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
   saveCustomer(customerData).then(data=>{
    toast.success("Customer Created")
navigate("/customer-details")
   }).catch(error=>{
    console.log(error)
    if(error.response.status==400 && error.response.data)
    {
      for(let err in error.response.data)
      toast.error(err+" : "+error.response.data[err])
    }
    else{
      toast.error("Internal Server Error or Email or Phone Number already Exist")
    }
   })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (

<Container>
{/* {JSON.stringify(customerData)} */}
      <h2>Enroll New Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="customerName">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            name="customerName"
            value={customerData.customerName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={customerData.address}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="regNo">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={customerData.email}
            onChange={handleInputChange}
          />
        </Form.Group> 
         <Form.Group controlId="carModel">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={customerData.phone}
            onChange={handleInputChange}
          />
        </Form.Group>
        {/* <Form.Group controlId="chasisNo">
          <Form.Label>Chasis Number (Chasis No)</Form.Label>
          <Form.Control
            type="text"
            name="chasisNo"
            value={customerData.chasisNo}
            onChange={handleInputChange}
          />
        </Form.Group> */}
        <Form.Group controlId="pin">
          <Form.Label>PIN</Form.Label>
          <Form.Control
            type="text"
            name="pin"
            value={customerData.pin}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            name="state"
            value={customerData.state}
            onChange={handleInputChange}
          />
        </Form.Group>
        {/* <Form.Group controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            name="code"
            value={customerData.code}
            onChange={handleInputChange}
          />
        </Form.Group> */}
        <Button variant="primary" type="submit" className='mt-3'>
          Enroll Customer
        </Button>
      </Form>
    </Container>
  );
};

export default NewCustomerForm;
