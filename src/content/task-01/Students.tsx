import {useState, useEffect} from 'react';
import {Student, Group, getGroup, Faculty, getFaculty} from '../../api/nsu_base';
import StudentView from './StudentView';

function StudentItem(props: {key: number, student: Student}) {
	return <li>
		<StudentView key={props.key} student={props.student}/>
	</li>;
}

function Students(props: {students: Student[]}) {
	return <div className='List'>
		<h2>Студенты:</h2>
		<ol>
			{
				props.students.map(student => {
					return <StudentItem key={student.id} student={student}/>
				})
			}
		</ol>
	</div>;
}

export default Students;