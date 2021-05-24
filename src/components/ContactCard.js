import React from 'react';
import { Link } from 'react-router-dom';
import user from '../images/user.png';
import trashIcon from '../images/trash-icon.png';

const ContactCard = (props) => {
  const { id, name, tel, url } = props.contact;

  return (
    <div className="card">
      <img className="card__image" src={url || user} alt="user" />
      <div className="card__content">
        <Link className="card__link" to={{ pathname:`/contact/${id}`, state:{contact: props.contact} }}>
          <h3 className="card__title">{name}</h3>
          <p className="card__text">{tel}</p>
        </Link>
      </div>
      <img className="card__trash-icon" src={trashIcon} alt="trash-icon" onClick={() => props.clickHandler(id)} />
    </div>
  );
};

export default ContactCard;
