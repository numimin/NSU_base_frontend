import {useState, useEffect} from 'react';
import {Teacher, Faculty, Department, getDepartment, getFaculty} from '../../api/nsu_base';

function TeacherView(props: {teacher: Teacher}) {
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [department, setDepartment] = useState<Department | null>(null);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			if (!department) return;
			setFaculty(await getFaculty(department.facultyId, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [department])

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setDepartment(await getDepartment(props.teacher.departmentId, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [props.teacher.departmentId]);

	const teacher = props.teacher;
	return <li>
		<p>{`${teacher.firstname} ${teacher.lastname} ${teacher.patronymic}`}</p>
		{
			faculty && <p>{faculty.name}</p>
		}
		{
			department && <p>{`Кафедра ${department.name}`}</p>
		}
		<p>{`Категория: ${teacher.category === "ASSISTANT" ? "Ассистент" : teacher.category === "PROFESSOR" ? "Профессор" : "Доцент"}`}</p>
		<p>{`Пол: ${teacher.gender === "MALE" ? "Мужской" : "Женский"}`}</p>
		<p>{`${teacher.hasChildren ? "Дети есть" : "Детей нет"}`}</p>
		<p>{`${teacher.graduateStudent ? "Обучается в аспирантуре" : ""}`}</p>
		<p>{teacher.phdThesisDate ? `Дата защиты: ${teacher.phdThesisDate}` : "Не защищался"}</p>
		<p>{`Зарплата: ${teacher.salary} рублей`}</p>
	</li>;
}

function Teachers(props: {teachers: Teacher[]}) {
	return <>
		<h2>Преподаватели:</h2>
		<ol>
			{
				props.teachers.map(teacher => <TeacherView key={teacher.id} teacher={teacher}/>)
			}
		</ol>
	</>;
}

export default Teachers;