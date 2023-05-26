import {useState, useEffect} from 'react';
import {Teacher, DepartmentLessonQuery, getTeachersFromPeriod} from '../../api/nsu_base';
import Teachers from '../task-02/Teachers';
import DepartmentForm from '../task-04/DepartmentForm';
import Header from '../Header';

function TeachersPeriodPage() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [query, setQuery] = useState<DepartmentLessonQuery>({
		groupId: null,
		course: null,
		facultyId: null,
		term: null,
		start: null,
		end: null
	});
	const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (update) {
			(async () => {
				const response = await getTeachersFromPeriod(query, controller.signal);
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
			<DepartmentForm query={query} onChange={q => {
				setQuery(q);
				setUpdate(true);
			}}/>
			<Teachers update={() => setUpdate(true)} teachers={teachers}/>
		</div>
	</>;
}

export default TeachersPeriodPage;