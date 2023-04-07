import {useState, useEffect} from 'react';
import {Student, StudentsWithMarkQuery, getStudentsWithMarks} from '../../api/nsu_base';
import Students from '../task-01/Students';
import StudentForm from './StudentForm';

function StudentsWithMarksPage() {
	const [students, setStudents] = useState<Student[]>([]);
	const [query, setQuery] = useState<StudentsWithMarkQuery>({
		lessonId: null,
		mark: null,
		groupIds: null,
	});

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getStudentsWithMarks(query, controller.signal);
			if (response !== null) {
				setStudents(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

	return <div className='Split'>
		<StudentForm query={query} onChange={setQuery}/>
		<Students students={students}/>
	</div>;
}

export default StudentsWithMarksPage;