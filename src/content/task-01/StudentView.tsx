import { useEffect, useState } from "react";
import { Faculty, Group, Student, deleteStudent, getFaculty, getGroup } from "../../api/nsu_base";

function StudentView(props: {update: () => void, student: Student, theme?: string}) {
	const [group, setGroup] = useState<Group | null>(null);
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [visible, setVisible] = useState(false);
	const [firstVisible, setFirstVisible] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				if (!group) return;
				setFaculty(await getFaculty(group.facultyId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [group, firstVisible])

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroup(await getGroup(student.groupId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [props.student, firstVisible]);

	const student = props.student;
	return <>
		<div onClick={e => {setVisible(!visible); setFirstVisible(true);}}className={"header" + (visible ? " visible" : "")}>
			<p>{`${student.firstname} ${student.lastname} ${student.patronymic}`}</p>
			<img src="/icons/delete.png" onClick={e => {
				(async () => {
					const response = await deleteStudent(student.id);
					props.update();
					alert(response?.message);	
				})();
			}}/>
		</div>
		<div hidden={!visible} className={"content " + (visible ? "" : "hidden")}>
			{
				faculty && <p><strong>{faculty.name}</strong></p>
			}
			{
				group && <p><strong>{`Группа `}</strong><span>{`${group.name}`}</span></p>
			}
			<p><strong>{`Пол: `}</strong><span>{`${student.gender === "MALE" ? "Мужской" : "Женский"}`}</span></p>
			<p><strong>{`Дата рождения:`}</strong><span>{` ${student.dateOfBirth}`}</span></p>
			<p><strong>{student.hasChildren ? "Дети " : "Детей "}</strong><span>{`${student.hasChildren ? "есть" : "нет"}`}</span></p>
			<p><strong>{`Стипендия:`}</strong><span>{` ${student.scholarship} рублей`}</span></p>
			{
				props.theme && 
				<p><strong>{`Тема дипломной работы:`}</strong><span>{` ${props.theme}`}</span></p>
			}
		</div>
	</>;
}

export default StudentView;