import {useState, useEffect} from 'react';
import {Student, Group, getGroup, Faculty, getFaculty} from '../../api/nsu_base';

function StudentView(props: {student: Student}) {
	const [group, setGroup] = useState<Group | null>(null);
	const [faculty, setFaculty] = useState<Faculty | null>(null);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			if (!group) return;
			setFaculty(await getFaculty(group.facultyId, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [group])

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setGroup(await getGroup(student.groupId, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [props.student]);

	const student = props.student;
	return <li>
		<p>{`${student.firstname} ${student.lastname} ${student.patronymic}`}</p>
		{
			faculty && <p>{faculty.name}</p>
		}
		{
			group && <p>{`Группа ${group.name}`}</p>
		}
		<p>{`Пол: ${student.gender === "MALE" ? "Мужской" : "Женский"}`}</p>
		<p>{`Дата рождения: ${student.dateOfBirth}`}</p>
		<p>{`${student.hasChildren ? "Дети есть" : "Детей нет"}`}</p>
		<p>{`Стипендия: ${student.scholarship} рублей`}</p>
	</li>;
}

function Students(props: {students: Student[]}) {
	return <>
		<h2>Students:</h2>
		<ol>
			{
				props.students.map(student => {
					return <StudentView key={student.id} student={student}/>
				})
			}
		</ol>
	</>;
}

export {
	Students,
}