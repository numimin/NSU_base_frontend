import React, { useState } from 'react';
import './App.scss';
import './scss/Split.scss';
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
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const [visible, setVisible] = useState(-1);
  const [hovered, setHovered] = useState(-1);

  return <div className="App">
    <div className='Header' onMouseEnter={e => setVisible(-1)}>
      <p>База НГУ</p>
    </div>
    <ol className='Nav'>
      <li onMouseEnter={e => setVisible(0)}>ОБЩИЕ</li>
      <li onMouseEnter={e => setVisible(1)}>ЗАНЯТИЯ</li>
      <li onMouseEnter={e => setVisible(2)}>ОЦЕНКИ И ЭКЗАМЕНЫ</li>
      <li onMouseEnter={e => setVisible(3)}>ДИПЛОМНЫЕ РАБОТЫ</li>
    </ol>
    <ol className='NavList'>
      <li onMouseEnter={e => setHovered(0)} onMouseLeave={e => {
        setHovered(-1);
        setVisible(-1);
      }} hidden={visible !== 0 && hovered !== 0}>
        <ol className='MicroNav'>
          <li><a href="/tasks/task-01">Студенты</a></li>
          <li><a href="/tasks/task-02">Преподаватели</a></li>
          <li><a href="/tasks/task-03">Диссертации</a></li>
          <li><a href="/tasks/task-13">Нагрузка</a></li>
        </ol>
      </li>
      <li onMouseEnter={e => setHovered(1)} onMouseLeave={e => {
        setHovered(-1);
        setVisible(-1);
      }} hidden={visible !== 1 && hovered !== 1}>
        <ol className='MicroNav'>
          <li><a href="/tasks/task-04">Кафедры</a></li>
          <li><a href="/tasks/task-05">Преподаватели</a></li>
          <li><a href="/tasks/task-06">Преподаватели за указанный период</a></li>
        </ol>
      </li>
      <li onMouseEnter={e => setHovered(2)} onMouseLeave={e => {
        setHovered(-1);
        setVisible(-1);
      }} hidden={visible !== 2 && hovered !== 2}>
        <ol className='MicroNav'>
          <li><a href="/tasks/task-07">Студенты, сдавшие зачет</a></li>
          <li><a href="/tasks/task-08">Студенты, сдавшие сессию</a></li>
          <li><a href="/tasks/task-09">Преподаватели, принимавшие экзамены</a></li>
          <li><a href="/tasks/task-10">Студенты, получившие оценку</a></li>
        </ol>
      </li>
      <li onMouseEnter={e => setHovered(3)} onMouseLeave={e => {
        setHovered(-1);
        setVisible(-1);
      }} hidden={visible !== 3 && hovered !== 3}>
        <ol className='MicroNav'>
          <li><a href="/tasks/task-11">Студенты и темы дипломов</a></li>
          <li><a href="/tasks/task-12">Руководители дипломных работ</a></li>
        </ol>
      </li>
    </ol>
    <BrowserRouter>
      <Routes>
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
