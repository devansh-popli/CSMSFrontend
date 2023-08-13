import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const CustomerDetails = ({ customer }) => {
  return (
    <div>
      <h2>Customer Details</h2>
      <Card>
        <Card.Header>Customer Information</Card.Header>
        <Card.Body>
          <Card.Title>{customer?.customerName}</Card.Title>
          <Card.Text>{customer?.phone}</Card.Text>
          <Card.Text>{customer?.email}</Card.Text>
          <Card.Text>Address: {customer?.address}</Card.Text>
          {/* Other customer details */}
        </Card.Body>
      </Card>

      <h3>Vehicles</h3>
      <ListGroup>
        {customer?.vehicles.map((vehicle) => (
          <ListGroup.Item key={vehicle.id}>
            <h5>Vehicle Details</h5>
            <p>Registration Number: {vehicle.regNo}</p>
            <p>Chasis Number: {vehicle.chasisNo}</p>
            <p>Car Model: {vehicle.carModel}</p>
            {/* Other vehicle details */}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CustomerDetails;
