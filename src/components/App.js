import React, { useState, useEffect, useRef } from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './Header';
import AddContact from './AddContact';
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';
import api from '../api/contacts';

function App() {

  // Переменные
  const LOCAL_STORAGE_UNIQUE_ID = 'uniqueID';
  const LOCAL_STORAGE_KEY = 'contacts';

  let [uniqueID, setUniqueID] = useState(1);
  const [contacts, setContacts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [connectingWith, setConnectingWith] = useState('api');
  const isInitialMountContacts = useRef(true);
  const isInitialMountUniqueID = useRef(true);



  // Вспомогательные функции ++++ ++++ ++++ ++++
  // Обработчик: добавляет новый контакт ко всем и увеличивает уникальный идетификатор
  async function addContactHandler(contact) {
    const request = {id: uniqueID, ...contact};

    if (connectingWith === 'localStorage') {
      setContacts([...contacts, request]);
    } else {
      const response = await api.post('/contacts', request);
      setContacts([...contacts, response.data]);
    }
    setUniqueID(uniqueID+1);
  }

  // Обработчик: отсеивает удаленный контакт по ID ипереписывает полученный массив контактов
  async function removeContactHandler(id) {
    if (connectingWith === 'api') {
      await api.delete(`/contacts/${id}`);
    }
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  function searchHandler(searchTerm) {
    setSearchTerm(searchTerm);
    if (searchTerm !== '') {
      const newContactList = contacts.filter((contact) => {
        return (contact.name + contact.tel)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); 
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults(contacts);
    }
  }



  // При монтировании компонента происходит проверка API, а затем локального хранилища на наличие
  // сохраненных пользователей от предыдущей работы с приложением. Переключение стейта работы
  useEffect(() => {
    async function getContacts() {
      try {
        const response = await api.get('/contacts');
        setContacts(response.data);
        setUniqueID(Number(response.data[response.data.length-1].id) + 1);
      } catch(e) {
        console.log('Поскольку локальный сервер не запущен, работа происходит с локальным хранилищем!');
        const allContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (allContacts) {
          setContacts(allContacts);
          setUniqueID(JSON.parse(localStorage.getItem(LOCAL_STORAGE_UNIQUE_ID)));
        };
        setConnectingWith('localStorage');
      }
    }
    getContacts();
  }, []);

  // Использование рефов для изменения стейта только при UPDATE
  // При изменении уникального идентификатора, его заносят в локальное хранилище
  useEffect(() => {
    if (isInitialMountUniqueID.current) {
      isInitialMountUniqueID.current = false;
    } else {
      localStorage.setItem(LOCAL_STORAGE_UNIQUE_ID, JSON.stringify(uniqueID));
    }
  }, [uniqueID]);

  // При изменении количества контактов, их заносят в локальное хранилище
  useEffect(() => {
    if (isInitialMountContacts.current) {
      isInitialMountContacts.current = false;
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts)); 
    }
  }, [contacts]);

  return (
    <>
      <Router>
        <Header />
        <Switch >

          <Route 
            path="/" 
            exact 
            render={(props) => (
              <ContactList {...props} contacts={searchTerm.length < 1 ? contacts : searchResults} getContactId={removeContactHandler} term={searchTerm} searchKeyword={searchHandler} />
          )} />

          <Route 
            path="/add" 
            render={(props) => (<AddContact {...props} addContactHandler={addContactHandler} />)}
          />

          <Route path="/contact/:id" component={ContactDetail} />

        </Switch>
      </Router>
    </>
  );
}

export default App;
