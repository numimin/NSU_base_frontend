import React from 'react';
import './App.css';
import StudentsPage from './content/task-01/StudentsPage';
import TeachersPage from './content/task-02/TeachersPage';
import DissertationsPage from './content/task-03/DissertationsPage';
import DepartmentsPage from './content/task-04/DepartmentsPage';
import TeacherLessonsPage from './content/task-05/TeacherLessonsPage';
import TeachersPeriodPage from './content/task-06/TeachersPeriodPage';

function App() {
  return <ol>
    <li>
      <TeachersPeriodPage/>
    </li>
    <li>
      <TeacherLessonsPage/>
    </li>
    <li>
      <DepartmentsPage/>
    </li>
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
