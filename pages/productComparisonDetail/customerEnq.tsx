import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import EnquiryForm from '/components/footer/footerTabs/enquiryForm';

const CustomerEnq = ({ show, toggleShow }) => {
  const locationContent = useSelector((state: any) => state?.storeReducer?.locationContent);
  console.log(locationContent);
  return (
    <>
      <Modal show={show} onHide={toggleShow} backdrop="static" keyboard={false} className="enquiryPopup">
        <Modal.Header closeButton closeLabel="">
          <Modal.Title>Enquiry form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EnquiryForm locations={locationContent.locations} />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CustomerEnq;
