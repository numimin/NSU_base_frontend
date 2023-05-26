import {useState, useEffect} from 'react';
import {TeacherLessonsQuery, getTeacherLessons, Teacher} from '../../api/nsu_base';
import Teachers from '../task-02/Teachers';
import TeacherForm from './TeacherForm';
import Header from '../Header';

function TeacherLessonsPage() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [query, setQuery] = useState<TeacherLessonsQuery>({
		groupId: null,
		course: null,
		lessonId: null,
		facultyId: null,
	});
	const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (update) {
			(async () => {
				const response = await getTeacherLessons(query, controller.signal);
				if (response !== null) {
					setTeachers(response);				
				}
				controller = null;
				setUpdate(false);
				if (!response) {
					setUpdate(true);
				}
			}) ();
		}
		return () => controller?.abort();
	}, [query, update]);

	return <>
		<Header/>
		<div className='Split'>
			<TeacherForm query={query} onChange={q => {
				setQuery(q);
				setUpdate(true);
			}}/>
			<div>
				<Teachers update={() => setUpdate(true)} teachers={teachers}/>
			</div>
		</div>
	</>;
}

export default TeacherLessonsPage;