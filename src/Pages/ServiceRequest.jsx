import React, { useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

const ServiceRequest = () => {
  const [services, setServices] = useState([]);
  const [gst, setGST] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalWithGst, setTotalWithGst] = useState(0);

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const handleServiceAdd = () => {
    setServices([...services, { name: '', price: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate total amount
      const totalAmount = services.reduce((total, service) => total + parseFloat(service.price), 0);
      const totalWithGSTAndTax = totalAmount * (1 + gst / 100) * (1 + tax / 100);
      setTotalWithGst(totalWithGSTAndTax)
      setTotal(totalAmount)
      // Create the service request object
      const serviceRequest = {
        services: services,
        totalAmount: totalWithGSTAndTax,
      };

      // Submit service request data to the API
      const response = await axios.post('/api/service-requests', serviceRequest);

      // Handle success or navigation
    } catch (error) {
      console.error('Error submitting service request:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Service Request Form</h2>
      <Form onSubmit={handleSubmit}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Enter service name"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={handleServiceAdd}>
          Add Service
        </Button>
        <Form.Group controlId="gst">
          <Form.Label>GST (%)</Form.Label>
          <Form.Control type="number" value={gst} onChange={(e) => setGST(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="tax">
          <Form.Label>Tax (%)</Form.Label>
          <Form.Control type="number" value={tax} onChange={(e) => setTax(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Service Request
        </Button>
        {totalWithGst}
        {total}
      </Form>
    </div>
  );
};

export default ServiceRequest;
