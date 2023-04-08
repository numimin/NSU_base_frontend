import {useState, useEffect} from 'react';
import {Department, DepartmentLessonQuery, getDepartmentsFromLessons} from '../../api/nsu_base';
import Departments from './Departments';
import DepartmentForm from './DepartmentForm';
import Header from '../Header';

function DepartmentsPage() {
	const [departments, setDepartments] = useState<Department[]>([]);
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
			const response = await getDepartmentsFromLessons(query, controller.signal);
			if (response !== null) {
				setDepartments(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

	return <>
		<Header/>
		<div className='Split'>
			<DepartmentForm query={query} onChange={setQuery}/>
			<Departments departments={departments}/>
		</div>
	</>;
}

export default DepartmentsPage;