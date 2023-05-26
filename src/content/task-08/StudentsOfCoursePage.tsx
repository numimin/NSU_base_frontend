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
    const [update, setUpdate] = useState(true);

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
        if (update) {
            (async () => {
                const response = await getStudentsOfCourseWithMarks(query, controller.signal);
                if (response !== null) {
                    setStudents(response);				
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
            <StudentForm query={query} onChange={q => {
                setQuery(q);
                setUpdate(true);
            }}/>
            <Students update={() => setUpdate(true)} students={students}/>
        </div>
    </>;
}

export default StudentsOfCoursePage;