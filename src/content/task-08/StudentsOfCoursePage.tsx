import {useState, useEffect} from 'react';
import { Student, StudentsOfCourseWithMarksQuery, getStudentsOfCourseWithMarks } from '../../api/nsu_base';
import Students from '../task-01/Students';
import StudentForm from './StudentForm';
import Header from '../Header';

function StudentsOfCoursePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [query, setQuery] = useState<StudentsOfCourseWithMarksQuery>({
        course: null,
        facultyId: null,
        term: null,
        marks: null,
        groupIds: null,
    });

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getStudentsOfCourseWithMarks(query, controller.signal);
			if (response !== null) {
				setStudents(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

    return <>
        <Header/>
        <div className='Split'>
            <StudentForm query={query} onChange={setQuery}/>
            <Students students={students}/>
        </div>
    </>;
}

export default StudentsOfCoursePage;