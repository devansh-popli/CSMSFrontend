import React, { useState, useEffect } from "react";
import { Table, Button, Container, Form, InputGroup } from "react-bootstrap";
import { getCustomers, getCustomersBySearch } from "../Service/CustomerService";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import VehicleRegistrationForm from "../Components/VehicleRegistrationForm";
import { toast } from "react-toastify";
import CustomerDetails from "../Components/CustomerDetails";
import Swal from "sweetalert2";
import axios from "axios";
import { privateAxios } from "../Service/AxiosService";
const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [oldCustomers, setOldCustomers] = useState([]);
  const [selectedCustomer,setSelectedCustomer]=useState({})
  const [show, setShow] = useState(false);
  const [customerShow, setCustomerShow] = useState(false);

  // Fetch and manage customer data here
  useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
      setOldCustomers
      (data);
    }).catch(error=>{
      toast.error("error while fetching customer")
    });
  }, []);

  const handleClose = () => setShow(false);
  const [search,setSearch]=useState("")
  const handleCustomerClose = () => setCustomerShow(false);
  const handleShow = (customer) => {
   setSelectedCustomer(customer)
    setShow(true);
  }
  const handleCustomerShow = (customer) => {
    console.log(customer)
   setSelectedCustomer(customer)
    setCustomerShow(true);
  }
  const searchCustomers=()=>{
    getCustomersBySearch(search).then(data=>{
      setCustomers(data);
    })
  }
  const handleDelete =  (customer) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await privateAxios.delete(`/api/customers/${customer.id}`);
          setCustomers(customers.filter(cust=>customer.id!=cust.id))
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          // Handle success or navigation to another page
        } catch (error) {
          console.error('Error deleting customer:', error);
          Swal.fire(
            'Error!',
            'Your file has not been deleted.',
            'error'
          )
          // Handle error
        }
     
      }
    })
 
  };
  const vehicleDetails = () => {
    return (
      selectedCustomer &&
      <>
      
        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            <VehicleRegistrationForm setCustomers={setCustomers} customers={customers} id={selectedCustomer?.id} handleClose={handleClose} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  const customerDetails = () => {
    return (
      selectedCustomer &&
      <>
      
        <Modal show={customerShow} onHide={handleCustomerClose}>
          <Modal.Body>
            <CustomerDetails customer={selectedCustomer} handleClose={handleCustomerClose} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCustomerClose}>
              Close
            </Button>
            {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  return (
    customers.length>0 ?
    <Container>
      <div>
        <h3 className="text-center my-3">Customer Management</h3>
        <InputGroup className="mb-3">
        <Button variant="outline-secondary" id="button-addon1" onClick={searchCustomers}>
          Search here
        </Button>
        <Form.Control
        onChange={(event)=>{
          setSearch(event.target.value)
          if(event.target.value=='')
          {
            setCustomers(oldCustomers)
          }
        }}
          aria-label="Example text with button addon"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
      {/* {search} */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{customer.customerName}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <Button className="mx-2" variant="info" size="sm"onClick={()=>handleCustomerShow(customer)}>
                    View Details
                  </Button>
                  <Button
                    onClick={()=>handleShow(customer)}
                    className="mx-2"
                    variant="dark"
                    size="sm"
                  >
                    Enter New Vehicle Details
                  </Button>
                  {
                    customer.serviceRequests.length>0 &&
                  <Button className="mx-2" variant="success" size="sm"  as={Link}
                  to={`/service-history/${customer.id}`}>
                    View Service History
                  </Button>
}
                 {customer.vehicles.length>0 && <Button
                    as={Link}
                    to={`/car-entry/${customer.id}`}
                    className="mx-2"
                    variant="primary"
                    size="sm"
                  >
                    Start New Service
                  </Button>
}
                  <Button onClick={()=>handleDelete(customer)} className="mx-2" variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {vehicleDetails()}
      {customerDetails()}
    </Container>
    :
    <Container className="text-center">
    <h1 className="mt-4">No Customer Details Yet</h1>
    <Button className="mt-3" variant="success" as={Link} to={"/new-customer"}>Enter New Customer Details</Button>
    </Container>
  );
};

export default CustomerManagement;
