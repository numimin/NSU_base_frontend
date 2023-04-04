import {useState, useEffect} from 'react';
import {TeacherLessonsQuery, getTeacherLessons, Teacher} from '../../api/nsu_base';
import Teachers from '../task-02/Teachers';
import TeacherForm from './TeacherForm';

function TeacherLessonsPage() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [query, setQuery] = useState<TeacherLessonsQuery>({
		groupId: null,
		course: null,
		lessonId: null,
		facultyId: null,
	});

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getTeacherLessons(query, controller.signal);
			if (response !== null) {
				setTeachers(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

	return <>
		<TeacherForm query={query} onChange={setQuery}/>
		<p>{`Всего преподавателей: ${teachers.length}`}</p>
		<Teachers teachers={teachers}/>
	</>;
}

export default TeacherLessonsPage;