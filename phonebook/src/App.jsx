import { useEffect, useState } from 'react';
import personService from './services/persons';
import './index.css';

// eslint-disable-next-line react/prop-types
const Filter = ({ handleFilter }) => (
  <div>
    filter shown with: <input id="filter" placeholder="Type to search..." type="text" autoComplete="on" onChange={handleFilter} />
  </div>
);

// eslint-disable-next-line react/prop-types
const PersonName = ({ handleChange, newName }) => (
  <div>
    name: <input id="name" placeholder='Name' type="text" autoComplete="on" value={newName} onChange={handleChange} />
  </div>
);

// eslint-disable-next-line react/prop-types
const PersonNumber = ({ handleChange2, newNumber }) => (
  <div>
    number: <input id="number" placeholder='Number' type="text" autoComplete="on" value={newNumber} onChange={handleChange2} />
  </div>
);

// eslint-disable-next-line react/prop-types
const Notification = ({ message }) => {
  if (!message) return null;
  return <div className="notification">{message}</div>;
};

// eslint-disable-next-line react/prop-types
const Notification2 = ({ message }) => {
  if (!message) return null;
  return <div className="notification2">{message}</div>;
};

// eslint-disable-next-line react/prop-types
const Notification3 = ({ message }) => {
  if (!message) return null;
  return <div className="notification3">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [informationMessage, setInformationMessage] = useState('');
  const [informationMessage2, setInformationMessage2] = useState('');
  const [informationMessage3, setInformationMessage3] = useState('');


  useEffect(() => {
    personService.get().then(data => {
      console.log("Fetched data:", data); // Debug log
      setPersons(data);
      setFilteredUsers(data);
    }).catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (event) => setNewName(event.target.value);

  const handleChange2 = (event) => setNewNumber(event.target.value);

  const handleAdd = () => {
    const newPerson = { name: newName, number: newNumber };

    if (newName === '' && newNumber === '') {
      setInformationMessage3('The name and the number of the person are missing.');
      setTimeout(() => setInformationMessage3(''), 5000);
    } else if (newName === '') {
      setInformationMessage3('The name of the person is missing.');
      setTimeout(() => setInformationMessage3(''), 5000);
    } else if (newNumber === '') {
      setInformationMessage3('The number of the person is missing.');
      setTimeout(() => setInformationMessage3(''), 5000);
    } else if (persons.some(person => person.name === newName)) {
        setInformationMessage3('The person is already added to the list.');
        setTimeout(() => setInformationMessage3(''), 5000);
    } else {
      personService.post(newPerson).then(addedPerson => {
        const updatedPersons = [...persons, addedPerson];
        setPersons(updatedPersons);
        setFilteredUsers(updatedPersons);
        setInformationMessage('Person added');
        setTimeout(() => setInformationMessage(''), 5000);
      }).catch(error => {
          let errorMessage = 'An error occurred'
           error = JSON.stringify(error.response.data);
            if (error.includes('name')) {
              errorMessage = 'The length of name is shorter than the minimum allowed length: 3';
            } else if (error.includes('number')) {
              errorMessage = 'The number is not in the correct format.';
            }
          
          setInformationMessage3(errorMessage);
          setTimeout(() => setInformationMessage3(''), 5000);
          })
    }

    setNewName('');
    setNewNumber('');
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = persons.filter(user => user.name.toLowerCase().startsWith(value));
    setFilteredUsers(filtered);
  };

  const deletePerson = (id) => {
    if (window.confirm(`Do you really want to delete person with this id: ${id}?`)) {
      personService.deleteItem(id).then(() => {
        const updatedPersons = persons.filter(person => person.id !== id);
        setPersons(updatedPersons);
        setFilteredUsers(updatedPersons);
        setInformationMessage2(`Information of person: ${id} is deleted`);
        setTimeout(() => setInformationMessage2(''), 5000);
      }).catch(error => console.log('Error deleting person:', error));
    }
  };

  return (
    <div>
      <h1 className='firstheader'>Phonebook</h1>
      <Notification message={informationMessage} />
      <Notification2 message={informationMessage2} />
      <Notification3 message={informationMessage3} />
      <Filter handleFilter={handleFilter} />
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Add a new</h2>
        <PersonName handleChange={handleChange} newName={newName} />
        <PersonNumber handleChange2={handleChange2} newNumber={newNumber} />
        <div>
          <button type="button" onClick={handleAdd}>Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredUsers.length > 0 ? filteredUsers.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button type="button" onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        )) : <li>No contacts found</li>}
      </ul>
    </div>
  );
};

export default App;
