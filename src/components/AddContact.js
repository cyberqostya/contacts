import React from 'react';
import { Link } from 'react-router-dom';

class AddContact extends React.Component {
  state = {
    name: '',
    tel: '',
    url: '',
  };

  add = (e) => {
    e.preventDefault();
    if(this.state.name === '' || this.state.tel === '') {
      alert('Some field is empty');
      return;
    }
    this.props.addContactHandler(this.state);
    this.setState({name: '', tel: '', url: ''});
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="adding">
        <h2 className="adding__title">Добавить контакт
          <Link to="/">
            <button className="adding__button button">Закрыть</button>
          </Link>
        </h2>
        <form className="adding__form" onSubmit={this.add}>
          <div className="adding__inputs-field">
            <input className="adding__input" type="text" name="name" placeholder="Имя" value={this.state.name} onChange={ (e) => this.setState({name: e.target.value}) } />
            <input className="adding__input" type="text" name="tel" placeholder="Телефон" value={this.state.tel} onChange={ (e) => this.setState({tel: e.target.value}) } />
            <input className="adding__input" type="text" name="image" placeholder="Ссылка на аватарку" value={this.state.url} onChange={ (e) => this.setState({url: e.target.value}) } />
          </div>
          <button className="adding__form-button button">Добавить</button>
        </form>
      </div>
    );
  }
}

export default AddContact;
