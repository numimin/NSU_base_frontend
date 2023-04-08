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

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getTeachersFromPeriod(query, controller.signal);
			if (response !== null) {
				setTeachers(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

	return <>
		<Header/>
		<div className='Split'>
			<DepartmentForm query={query} onChange={setQuery}/>
			<Teachers teachers={teachers}/>
		</div>
	</>;
}

export default TeachersPeriodPage;