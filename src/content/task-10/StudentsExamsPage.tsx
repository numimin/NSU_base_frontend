import { useState, useEffect } from "react";
import { Student, StudentsExamsQuery, getStudentsByExams, getTeachersByExams } from "../../api/nsu_base";
import Students from "../task-01/Students";
import StudentForm from "./StudentForm";
import Header from "../Header";

function StudentsExamsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [query, setQuery] = useState<StudentsExamsQuery>({
        teacherId: null,
        mark: null,
        groupIds: null,
        lessonIds: null,
        terms: null,
        start: null,
        end: null,
    });
    const [update, setUpdate] = useState(true);

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
        if (update) {
            (async () => {
                const response = await getStudentsByExams(query, controller.signal);
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

export default StudentsExamsPage;   