import { useEffect, useState } from "react";
import { Faculty, Group, Student, getFaculty, getGroup } from "../../api/nsu_base";

function StudentView(props: {student: Student, theme?: string}) {
	const [group, setGroup] = useState<Group | null>(null);
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [visible, setVisible] = useState(false);

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
	return <>
		<p onClick={e => setVisible(!visible)} className={"header " + (visible ? "visible" : "")}>{`${student.firstname} ${student.lastname} ${student.patronymic}`}</p>
		<div className={"content " + (visible ? "" : "hidden")}>
			{
				faculty && <p><strong>{faculty.name}</strong></p>
			}
			{
				group && <p><strong>{`Группа `}</strong>{`${group.name}`}</p>
			}
			<p><strong>{`Пол: `}</strong>{`${student.gender === "MALE" ? "Мужской" : "Женский"}`}</p>
			<p><strong>{`Дата рождения:`}</strong>{` ${student.dateOfBirth}`}</p>
			<p><strong>{student.hasChildren ? "Дети " : "Детей "}</strong>{`${student.hasChildren ? "есть" : "нет"}`}</p>
			<p><strong>{`Стипендия:`}</strong>{` ${student.scholarship} рублей`}</p>
			{
				props.theme && 
				<p><strong>{`Тема дипломной работы:`}</strong>{` ${props.theme}`}</p>
			}
		</div>
	</>;
}

export default StudentView;