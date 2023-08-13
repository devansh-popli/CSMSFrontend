import React, { useEffect, useState } from "react";
import { Form, Button, Container, Table, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerById, getCustomers } from "../Service/CustomerService";
import { getVehicleByCustomer, saveVehicle } from "../Service/VehicleService";
import { toast } from "react-toastify";
import { generateInvoice, saveServiceRequest } from "../Service/ServiceRequestService";
import { privateAxios } from "../Service/AxiosService";

export const CarEntry = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    jobCard: "",
    regNo: "",
    carModel: "",
    chasisNo: "",
    mileage: "",
    serviceType: "",
    placeOfSupply: "",
    pin: "",
    state: "",
    code: "",
    mobileGSTNum: "",
    demandedRepairs: "",
    suggestedJob: "",
  });
  const [services, setServices] = useState([]);
  const [gst, setGST] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [invoiceLink, setInvoiceLink] = useState('');

  const [totalWithGst, setTotalWithGst] = useState(0);

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const handleServiceAdd = () => {
    setServices([...services, { name: "", price: 0 }]);
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate total amount
      const totalAmount = services.reduce(
        (total, service) => total + parseFloat(service.price),
        0
      );
      const totalWithGSTAndTax =
        totalAmount * (1 + gst / 100) * (1 + tax / 100);
      setTotalWithGst(totalWithGSTAndTax);
      setTotal(totalAmount);
      // Create the service request object
      const serviceRequest = {};

      // Submit service request data to the API
      const response = await privateAxios.post(
        "/api/service-requests",
        serviceRequest
      );

      // Handle success or navigation
    } catch (error) {
      console.error("Error submitting service request:", error);
      // Handle error
    }
  };
  const { id } = useParams();
  useEffect(() => {
    getCustomerById(id).then((data) => {
      if (data.vehicles.length == 1) {
        data.regNo = data.vehicles[0].regNo;
        // setFormData({...formData,regNo:})
      }
      setFormData({ ...formData, ...data });
      setVehicles(data.vehicles);
    });
  }, []);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic or API calls here
    const totalAmount = services.reduce(
      (total, service) => total + parseFloat(service.price),
      0
    );
    const totalWithGSTAndTax =
      totalAmount * (1 + gst / 100) * (1 + tax / 100);
    setTotalWithGst(totalWithGSTAndTax);
    setTotal(totalAmount);
    saveServiceRequest({
      customer: { id: id },
      vehicle: { id: vehicles.find((v) => formData.regNo == v.regNo).id },
      serviceItems: services,
      gst: gst,
      tax: tax,
      totalAmount: totalWithGSTAndTax,
      ...formData,
    }).then(async (res) => {
      if(formData.generateInvoice){
        console.log(res)
        console.log(res.id+"idid")
        try {
          const response = await privateAxios.get(`/api/service-requests/${res.id}`, {
            responseType: 'blob',
          });
    
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          console.log(url)
          setInvoiceLink(url);
    
          setShowModal(true);
        } catch (error) {
          console.error('Error generating invoice:', error);
          // Handle error
        }
      //   generateInvoice(res.id).then(response=>{
      //     const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = URL.createObjectURL(blob);
      // setInvoiceLink(url);

      // setShowModal(true);
      //   })
      }
      toast.success("Service Details Saved");
      // navigate("/customer-details");
    });
  };
  const serviceTypes = [
    "Routine Maintenance",
    "Repairs",
    "Diagnostics",
    "Tuning and Adjustments",
    "Bodywork and Painting",
    // ... other service types
  ];
  return (
    <Container>
      
      <Modal show={showModal} onHide={() =>{ 
        setShowModal(false)
        navigate("/customer-details")
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Generated Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {invoiceLink && (
            <a href={invoiceLink} download="invoice.pdf">
              Download Invoice
            </a>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShowModal(false)
          navigate("/customer-details")
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* {JSON.stringify(formData)} */}
      <h2 className="text-center mt-4">Car Service Form</h2>
      <Form onSubmit={handleSubmit} className="mt-2">
        <Form.Group controlId="customerName">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </Form.Group>
        {/* <Form.Group controlId="jobCard">
          <Form.Label>Job Card</Form.Label>
          <Form.Control
            type="text"
            value={formData.jobCard}
            onChange={(e) =>
              setFormData({ ...formData, jobCard: e.target.value })
            }
          />
        </Form.Group> */}
        <Form.Group controlId="regNo">
          <Form.Label>Registration Number</Form.Label>
          <Form.Select
            type="text"
            value={formData.regNo}
            onChange={(e) =>
              setFormData({ ...formData, regNo: e.target.value })
            }
          >
            <option key={"none"} value={"none"}>
              Please Select
            </option>
            {vehicles?.map((vehicle) => (
              <option key={vehicle.regNo} value={vehicle.regNo}>
                {vehicle.regNo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="carModel">
          <Form.Label>Car Model</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={vehicles
              .filter((data) => formData.regNo == data.regNo)
              .map((data) => data.carModel)}
            onChange={(e) =>
              setFormData({ ...formData, carModel: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="chasisNo">
          <Form.Label>Chasis Number</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={vehicles
              .filter((data) => formData.regNo == data.regNo)
              .map((data) => data.chasisNo)}
            onChange={(e) =>
              setFormData({ ...formData, chasisNo: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="mileage">
          <Form.Label>Mileage</Form.Label>
          <Form.Control
            type="text"
            value={formData.mileage}
            onChange={(e) =>
              setFormData({ ...formData, mileage: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="mileage">
          <Form.Label>Service Date</Form.Label>
          <Form.Control
            type="date"
            value={formData.serviceDate}
            onChange={(e) =>
              setFormData({ ...formData, serviceDate: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="serviceType">
          <Form.Label>Service Type</Form.Label>
          <Form.Select
            name="serviceType"
            value={formData.serviceType}
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceType: e.target.value,
              })
            }
          >
            <option value="none">Select a Service Type</option>
            {serviceTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="placeOfSupply">
          <Form.Label>Place of Supply</Form.Label>
          <Form.Control
            type="text"
            value={formData.placeOfSupply}
            onChange={(e) =>
              setFormData({ ...formData, placeOfSupply: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="pin">
          <Form.Label>Pin Code</Form.Label>
          <Form.Control
            type="text"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="mobileGSTNum">
          <Form.Label>Mobile GST Number</Form.Label>
          <Form.Control
            type="text"
            value={formData.mobileGSTNum}
            onChange={(e) =>
              setFormData({ ...formData, mobileGSTNum: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="demandedRepairs">
          <Form.Label>Demanded Repairs</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.demandedRepairs}
            onChange={(e) =>
              setFormData({ ...formData, demandedRepairs: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="suggestedJob">
          <Form.Label>Suggested Job / Fault Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.suggestedJob}
            onChange={(e) =>
              setFormData({ ...formData, suggestedJob: e.target.value })
            }
          />
        </Form.Group>
        {/* <Form onSubmit={handleInvoiceSubmit}> */}
        <Table striped bordered responsive> 
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
                    onChange={(e) =>
                      handleServiceChange(index, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(index, "price", e.target.value)
                    }
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
          <Form.Control
            type="number"
            value={gst}
            onChange={(e) => setGST(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="tax">
          <Form.Label>Tax (%)</Form.Label>
          <Form.Control
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
          />
        </Form.Group>
        {/* <Button variant="primary" type="submit">
          Submit Service Request
        </Button> */}
        {/* {totalWithGst}
        {total} */}
        {/* </Form> */}
        <Form.Group controlId="generateInvoice">
          <Form.Check
            type="checkbox"
            label="Generate Invoice"
            name="generateInvoice"
            checked={formData.generateInvoice}
            onChange={(e) =>
              setFormData({ ...formData, generateInvoice: e.target.checked })
            }
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3 text-center">
          Submit
        </Button>
      </Form>
    </Container>
  );
};
