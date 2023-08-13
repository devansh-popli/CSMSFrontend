import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getCustomerById } from "../Service/CustomerService";
import { generateInvoice } from "../Service/ServiceRequestService";
import { privateAxios } from "../Service/AxiosService";

const ServiceHistory = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [invoiceLink, setInvoiceLink] = useState('')
  const { id } = useParams();
  useEffect(() => {
    // getCustomerById(id).then((data) => {
    //   setServiceRequests(data.serviceRequests);
    // });

    getCustomer();
  }, []);
  const getCustomer = async () => {
    const data = await getCustomerById(id);
    setServiceRequests(data);
  };
  const generateInvoic=async (serviceRequestId)=>{
    try {
      const response = await privateAxios.get(`/api/service-requests/${serviceRequestId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log(url)
      setInvoiceLink(url);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating invoice:', error);
      // Handle error
    }
  }
  return (
    <Container>
      <h2>Service History</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>Sno</th>
          <th>Service Date</th>
          <th>Vehicles</th>
            <th>Service Type</th>
            <th>Status</th>
            <th>Mileage</th>
            <th>Place of Supply</th>
            <th>Mobile GST Num</th>
            <th>Demanded Repairs</th>
            <th>Suggested Job</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceRequests.serviceRequests?.map((request,Index) => (
            <tr key={request.id}>
              <td>{Index+1}</td>
              <td>{request.serviceDate}</td>
              <td>
                  <p>
                    {request?.vehicle?.carModel} - {request?.vehicle?.regNo}
                  </p>
              </td>
              <td>{request.serviceType}</td>
              <td>{request.status}</td>
              <td>{request.mileage}</td>
              <td>{request.placeOfSupply}</td>
              <td>{request.mobileGSTNum}</td>
              <td>{request.demandedRepairs}</td>
              <td>{request.suggestedJob}</td>
              <td><Button variant="dark"size="sm" onClick={()=>generateInvoic(request.id)}>Generate Invoice</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ServiceHistory;
