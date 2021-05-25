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

  const contactsForTheFirstStart = [
    { name: "Bill", tel: "8 800 555-35-35", id: 1, url: "data:image/jpeg;base64,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" },
    { name: "Steave", tel: "8 900 666-36-36", id: 2, url: "https://cdn.vox-cdn.com/thumbor/TN8KVPXDr7xVJH3Y3AlNWVs6Hhk=/0x86:706x557/1400x1400/filters:focal(0x86:706x557):format(png)/cdn.vox-cdn.com/assets/738480/stevejobs.png" },
    { name: "Mark", tel: "8 777 123-31-45", id: 3, url: "data:image/jpeg;base64,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" }];



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
        
        // Рендеринг контактов при самом первом запуске приложения
        if (!localStorage.getItem(LOCAL_STORAGE_UNIQUE_ID)) {
          setContacts(contactsForTheFirstStart);
          setUniqueID(contactsForTheFirstStart[contactsForTheFirstStart.length - 1].id + 1)
        }
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
