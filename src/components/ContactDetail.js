import React from 'react';
import { Link } from 'react-router-dom';
import user from '../images/user.png';

const ContactDetail = (props) => {
  const { name, tel, url } = props.location.state.contact;

  return (
    <div className="detail">
      <img className="detail__image" src={url || user} alt="user" />
      <h3 className="detail__title">{name}</h3>
      <p className="detail__text">{tel}</p>
      <Link to="/"><button className="detail__button button">Назад</button></Link>
    </div>
  );
};

export default ContactDetail;
