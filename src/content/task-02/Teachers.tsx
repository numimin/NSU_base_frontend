import {useState, useEffect} from 'react';
import {Teacher, Faculty, Department, getDepartment, getFaculty} from '../../api/nsu_base';

function TeacherView(props: {teacher: Teacher}) {
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [department, setDepartment] = useState<Department | null>(null);
	const [visible, setVisible] = useState(false);

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
		<p onClick={e => setVisible(!visible)} className={"header " + (visible ? "visible" : "")}>{`${teacher.firstname} ${teacher.lastname} ${teacher.patronymic}`}</p>
		<div className={'content '  + (visible ? "" : "hidden")}>
			{
				faculty && <p><strong>{faculty.name}</strong></p>
			}
			{
				department && <p><strong>{`Кафедра`}</strong>{` ${department.name}`}</p>
			}
			<p><strong>{`Категория:`}</strong>{` ${teacher.category === "ASSISTANT" ? "Ассистент" : teacher.category === "PROFESSOR" ? "Профессор" : "Доцент"}`}</p>
			<p><strong>{`Пол:`}</strong>{` ${teacher.gender === "MALE" ? "Мужской" : "Женский"}`}</p>
			<p><strong>{teacher.hasChildren ? "Дети " : "Детей "}</strong>{`${teacher.hasChildren ? "есть" : "нет"}`}</p>
			<p><strong>{`${teacher.graduateStudent ? "Обучается в аспирантуре" : ""}`}</strong></p>
			<p><strong>{teacher.phdThesisDate ? "Дата защиты: " : "Не защищался"}</strong>{teacher.phdThesisDate ? `${teacher.phdThesisDate}` : ""}</p>
			<p><strong>{`Зарплата:`}</strong>{` ${teacher.salary} рублей`}</p>
		</div>
	</li>;
}

function Teachers(props: {teachers: Teacher[]}) {
	return <div>
		<h2>Преподаватели:</h2>
		<ol className='List'>
			{
				props.teachers.map(teacher => <TeacherView key={teacher.id} teacher={teacher}/>)
			}
		</ol>
	</div>;
}

export default Teachers;