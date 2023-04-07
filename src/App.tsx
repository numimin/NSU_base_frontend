import React from 'react';
import './App.css';
import StudentsPage from './content/task-01/StudentsPage';
import TeachersPage from './content/task-02/TeachersPage';
import DissertationsPage from './content/task-03/DissertationsPage';
import DepartmentsPage from './content/task-04/DepartmentsPage';
import TeacherLessonsPage from './content/task-05/TeacherLessonsPage';
import TeachersPeriodPage from './content/task-06/TeachersPeriodPage';
import StudentsWithMarksPage from './content/task-07/StudentsWithMarksPage';
import StudentsOfCoursePage from './content/task-08/StudentsOfCoursePage';
import TeachersExamsPage from './content/task-09/TeachersExamsPage';
import StudentsExamsPage from './content/task-10/StudentsExamsPage';
import StudentsGraduateWorksPage from './content/task-11/StudentsGraduateWorksPage';
import TeachersGraduateWorksPage from './content/task-12/TeachersGraduateWorksPage';
import TeachersLoadPage from './content/task-13/TeachersLoadPage';

function App() {
  return <ol>
    <li>
      <TeachersLoadPage/>
    </li>
    <li>
      <TeachersGraduateWorksPage/>
    </li>
    <li>
      <StudentsGraduateWorksPage/>
    </li>
    <li>
      <StudentsExamsPage/>
    </li>
    <li>
      <TeachersExamsPage/>
    </li>
    <li>
      <StudentsOfCoursePage/>
    </li>
    <li>
      <StudentsWithMarksPage/>
    </li>
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
