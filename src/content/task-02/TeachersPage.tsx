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
	const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (update) {
			(async () => {
				if (!query) return;
				const response = await getTeachers(query, controller.signal);
				setTeachers(response ? response : []);
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
			<Teachers update={() => setUpdate(true)}teachers={teachers}/>
		</div>
	</>;
}

export default TeachersPage;