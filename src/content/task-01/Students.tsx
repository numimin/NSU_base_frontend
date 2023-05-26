import {useState, useEffect} from 'react';
import {Student, Group, getGroup, Faculty, getFaculty} from '../../api/nsu_base';
import StudentView from './StudentView';

function StudentItem(props: {update: () => void, key: number, student: Student}) {
	return <li>
		<StudentView update={props.update} key={props.key} student={props.student}/>
	</li>;
}

function Students(props: {update: () => void, students: Student[]}) {
	return <div>
		<h2 className='ListHeader'>Студенты</h2>
		<ol className='List'>
			{
				props.students.sort((lhs, rhs) => {
					const lhsName = lhs.firstname + lhs.lastname + lhs.patronymic;
					const rhsName = rhs.firstname + rhs.lastname + rhs.patronymic;
					if (lhsName <= rhsName) {
						return 1;
					}
					if (lhsName >= rhsName) {
						return -1;
					}
					return 0;
				}).map(student => {
					return <StudentItem key={student.id} student={student} update={() => {
						props.update();
					}}/>
				})
			}
		</ol>
	</div>;
}

export default Students;