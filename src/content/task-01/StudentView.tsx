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
		<p onClick={e => setVisible(!visible)} className="header">{`${student.firstname} ${student.lastname} ${student.patronymic}`}</p>
		<div className={"content " + (visible ? "" : "hidden")}>
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
			{
				props.theme && 
				<p>{`Тема дипломной работы: ${props.theme}`}</p>
			}
		</div>
	</>;
}

export default StudentView;