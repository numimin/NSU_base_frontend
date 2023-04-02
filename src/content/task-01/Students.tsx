import {useState} from 'react';
import {Student} from '../../api/nsu_base';

function Students(props: {students: Student[]}) {
	return <>
		<h2>Students:</h2>
		<ol>
			{
				props.students.map(student => {
					return <li key={student.id}>
						<p>{`${student.firstname} ${student.lastname} ${student.patronymic}`}</p>
						<p>{`Пол: ${student.gender === "MALE" ? "Мужской" : "Женский"}`}</p>
						<p>{`Дата рождения: ${student.dateOfBirth}`}</p>
						<p>{`${student.hasChildren ? "Дети есть" : "Детей нет"}`}</p>
						<p>{`Стипендия: ${student.scholarship} рублей`}</p>
					</li>
				})
			}
		</ol>
	</>;
}

export {
	Students,
}