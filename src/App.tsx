import React from 'react';
import './App.css';
import StudentsPage from './content/task-01/StudentsPage';
import TeachersPage from './content/task-02/TeachersPage';

function App() {
  return <ol>
    <li>
      <TeachersPage/>
      <StudentsPage/>
    </li>
  </ol>;
}

export default App;
