import {useState, useEffect} from 'react';
import {Teacher, TeachersQuery, getTeachers} from '../../api/nsu_base';
import Teachers from './Teachers';
import TeacherForm from './TeacherForm';
import Header from '../Header';

function TeachersPage() {
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [query, setQuery] = useState<TeachersQuery>({
		category: "NONE",
		gender: "NONE",
		hasChildren: "NONE",
		minSalary: null,
		maxSalary: null,
		graduateStudent: "NONE",
		facultyIds: [],
		departmentIds: [],
		phdThesisStartDate: null,
		phdThesisEndDate: null
	});

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			if (!query) return;
			const response = await getTeachers(query, controller.signal);
			setTeachers(response ? response : []);
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

	return <>
		<Header/>
		<div className='Split'>
			<TeacherForm query={query} onChange={setQuery}/>
			<Teachers teachers={teachers}/>
		</div>
	</>;
}

export default TeachersPage;