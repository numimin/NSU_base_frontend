import {useState, useEffect} from 'react';
import {Student, Group, getGroup, Faculty, getFaculty} from '../../api/nsu_base';
import StudentView from './StudentView';

function Students(props: {students: Student[]}) {
	return <>
		<h2>Студенты:</h2>
		<ol>
			{
				props.students.map(student => {
					return <li>
						 <StudentView key={student.id} student={student}/>
					</li>;
				})
			}
		</ol>
	</>;
}

export default Students;