import React, { useState } from 'react';
import './App.scss';
import './scss/Split.scss';
import './scss/Form.scss';
import './scss/List.scss';
import './content/forms/Select.scss';
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
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to='/tasks/task-01'/>}/>
        <Route path="/tasks/task-01" element={<StudentsPage/>}/>
        <Route path="/tasks/task-02" element={<TeachersPage/>}/>
        <Route path="/tasks/task-03" element={<DissertationsPage/>}/>
        <Route path="/tasks/task-04" element={<DepartmentsPage/>}/>
        <Route path="/tasks/task-05" element={<TeacherLessonsPage/>}/>
        <Route path="/tasks/task-06" element={<TeachersPeriodPage/>}/>
        <Route path="/tasks/task-07" element={<StudentsWithMarksPage/>}/>
        <Route path="/tasks/task-08" element={<StudentsOfCoursePage/>}/>
        <Route path="/tasks/task-09" element={<TeachersExamsPage/>}/>
        <Route path="/tasks/task-10" element={<StudentsExamsPage/>}/>
        <Route path="/tasks/task-11" element={<StudentsGraduateWorksPage/>}/>
        <Route path="/tasks/task-12" element={<TeachersGraduateWorksPage/>}/>
        <Route path="/tasks/task-13" element={<TeachersLoadPage/>}/>
      </Routes>
    </BrowserRouter>
  </div>;
}

export default App;
