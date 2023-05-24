import {useState, useEffect} from 'react';
import {Teacher, Faculty, Department, getDepartment, getFaculty} from '../../api/nsu_base';

function TeacherView(props: {teacher: Teacher}) {
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [department, setDepartment] = useState<Department | null>(null);
	const [visible, setVisible] = useState(false);
	const [firstVisible, setfirstVisible] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				if (!department) return;
				setFaculty(await getFaculty(department.facultyId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [department, firstVisible])

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setDepartment(await getDepartment(props.teacher.departmentId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [props.teacher.departmentId, firstVisible]);

	const teacher = props.teacher;
	return <li>
		<p onClick={e => {setVisible(!visible); setfirstVisible(true);}} className={"header " + (visible ? "visible" : "")}>{`${teacher.firstname} ${teacher.lastname} ${teacher.patronymic}`}</p>
		<div className={'content '  + (visible ? "" : "hidden")}>
			{
				faculty && <p><strong>{faculty.name}</strong></p>
			}
			{
				department && <p><strong>{`Кафедра`}</strong><span>{` ${department.name}`}</span></p>
			}
			<p><strong>{`Категория:`}</strong><span>{` ${teacher.category === "ASSISTANT" ? "Ассистент" : teacher.category === "PROFESSOR" ? "Профессор" : "Доцент"}`}</span></p>
			<p><strong>{`Пол:`}</strong><span>{` ${teacher.gender === "MALE" ? "Мужской" : "Женский"}`}</span></p>
			<p><strong>{teacher.hasChildren ? "Дети " : "Детей "}</strong><span>{`${teacher.hasChildren ? "есть" : "нет"}`}</span></p>
			<p><strong>{`${teacher.graduateStudent ? "Обучается в аспирантуре" : ""}`}</strong></p>
			<p><strong>{teacher.phdThesisDate ? "Дата защиты: " : "Не защищался"}</strong><span>{teacher.phdThesisDate ? `${teacher.phdThesisDate}` : ""}<span/></span></p>
			<p><strong>{`Зарплата:`}</strong><span>{` ${teacher.salary} рублей`}<span/></span></p>
		</div>
	</li>;
}

function Teachers(props: {teachers: Teacher[]}) {
	return <div>
		<h2>Преподаватели</h2>
		<ol className='List'>
			{
				props.teachers.map(teacher => <TeacherView key={teacher.id} teacher={teacher}/>)
			}
		</ol>
	</div>;
}

export default Teachers;