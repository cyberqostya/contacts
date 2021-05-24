import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactCard from './ContactCard';
import searchIcon from '../images/search-icon.png';

const ContactList = (props) => {
  const deleteContactHandler = (id) => {
    props.getContactId(id);
  };

  const renderContactList = props.contacts.map((contact) => {
    return (
     <ContactCard 
      contact={contact} 
      key={contact.id} 
      clickHandler={deleteContactHandler} />
    );
  });

  const inputEl = useRef('');

  function getSearchTerm() {
    props.searchKeyword(inputEl.current.value);
  }

  return (
    <section className="list">
      <h2 className="list__title">Список контактов
        <Link to="/add">
          <button className="list__button button">Добавить</button>
        </Link>
      </h2>
      <div className="list__search-field">
        <input ref={inputEl} type="text" placeholder="Поиск" className="list__search-input" value={props.term} onChange={getSearchTerm} />
        <img className="list__search-icon" src={searchIcon} alt="search-icon" />
      </div>
      <div className="list__container">
        {renderContactList.length > 0 ? renderContactList : 'Поиск не показал результатов'}
      </div>
    </section>
  );
}

export default ContactList;
