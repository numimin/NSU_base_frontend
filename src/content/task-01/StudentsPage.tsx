import {useState, useEffect} from 'react';
import {StudentQuery, Student, getStudents} from '../../api/nsu_base';
import {StudentsForm} from './StudentsForm';
import {Students} from './Students';

function StudentsPage() {
	const [query, setQuery] = useState<StudentQuery>({
		gender: "NONE"
	});
	const [students, setStudents] = useState<Student[]>([]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			if (!query) return;
			const response = await getStudents(query, controller.signal);
			setStudents(response ? response : []);
			console.log(response);				
			controller = null;
		}) ();
	}, [query]);

	return <>
		<StudentsForm query={query} onChange={q => setQuery(q)}/>
		<Students students={students}/>
	</>;
}

export default StudentsPage;