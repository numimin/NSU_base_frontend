import {useState, useEffect} from 'react';
import {StudentQuery, Student, getStudents} from '../../api/nsu_base';
import {StudentsForm} from './StudentsForm';
import Students from './Students';
import Header from '../Header';

function StudentsPage() {
	const [query, setQuery] = useState<StudentQuery>({
		gender: "NONE",
		year: null,
		age: null,
		hasChildren: "NONE",
		minScholarship: null,
		maxScholarship: null,
		groupIds: [],
		facultyIds: [],
	});
	const [students, setStudents] = useState<Student[]>([]);
	const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (update) {
			(async () => {
				if (!query) return;
				const response = await getStudents(query, controller.signal);
				setStudents(response ? response : []);
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
			<StudentsForm query={query} onChange={q => {
				setQuery(q);
				setUpdate(true);
			}}/>
			<Students update={() => setUpdate(true)}students={students}/>
		</div>
	</>;
}

export default StudentsPage;