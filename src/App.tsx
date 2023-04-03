import React from 'react';
import './App.css';
import StudentsPage from './content/task-01/StudentsPage';
import TeachersPage from './content/task-02/TeachersPage';
import DissertationsPage from './content/task-03/DissertationsPage';

function App() {
  return <ol>
    <li>
      <DissertationsPage/>
    </li>
    <li>
      <TeachersPage/>
    </li>
    <li>
      <StudentsPage/>
    </li>
  </ol>;
}

export default App;
