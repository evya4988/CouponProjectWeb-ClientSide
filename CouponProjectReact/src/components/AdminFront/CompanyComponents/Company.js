import './Company.css';
import Backdrop from '../../UI/Backdrop';
import Modal from '../../UI/Modal';
import { useState } from 'react';

const Company = (props) => {
    const [showModal, setShowModal] = useState(false);

    const showModalHandler = () => {
        console.log(props.company.coupons);
        setShowModal(true);
    };

    const closeModalHandler = () => {
        setShowModal(false);
    }

    return (
        <div className='company'>
            <h1>{props.company.name}</h1>
            <section>
                <h3>{props.company.email}</h3>
                <h3>{props.company.password}</h3>
            </section>
            <button onClick={showModalHandler}>Show Coupons</button>
            {showModal && <Backdrop onClose={closeModalHandler} />}
            {showModal && <Modal coupons={props.company.coupons} onClose={closeModalHandler} />}
        </div >
    );
};

export default Company;