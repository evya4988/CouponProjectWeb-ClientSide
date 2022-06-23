import './Customer.css';
import Backdrop from '../../UI/Backdrop';
import Modal from '../../UI/Modal';
import { useState } from 'react';

const Customer = (props) => {
    const [showModal, setShowModal] = useState(false);

    const showModalHandler = () => {
        console.log(props.customer.coupons);
        setShowModal(true);
    };

    const closeModalHandler = () => {
        setShowModal(false);
    }

    return (
        <div className='customer'>
            <h1>{props.customer.firstName} {props.customer.lastName}</h1>
            <section>
                <h3>{props.customer.email}</h3>
                <h3>{props.customer.password}</h3>
            </section>
            <button onClick={showModalHandler}>Show Coupons</button>
            {showModal && <Backdrop onClose={closeModalHandler} />}
            {showModal && <Modal coupons={props.customer.coupons} onClose={closeModalHandler} />}
        </div >
    );
};

export default Customer;