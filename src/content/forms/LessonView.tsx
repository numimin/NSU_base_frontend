import {TeacherLessonsQuery, Group, Lesson, Faculty, getGroups, getFaculties, getLessons, getGroup} from '../../api/nsu_base';
import {useState, useEffect} from 'react';

function LessonView(props: {lesson: Lesson, lessonId: number | null, onChange: (lessonId: number) => void}) {
	const [group, setGroup] = useState<Group | null>(null);

	const lesson = props.lesson;

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setGroup(await getGroup(lesson.groupId, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [lesson]);

	const groupName = group ? " (" + group.name + ")": "";
	return <li key={lesson.id}>
			<input type="radio" 
			   id={`faculty${lesson.id}`} 
			   checked={props.lessonId === lesson.id}
			   onChange={e => {
			   	if (e.target.checked) {
			   		props.onChange(lesson.id);
			   	}
			   }}/>
			<label htmlFor={`faculty${lesson.id}`}>{(lesson.type === "LECTURE" ? "(лек.) " : lesson.type === "PRACTICE" ? "(сем.) " : "(лаб.) ") + lesson.name + groupName}</label>
		</li>;
}

export default LessonView;