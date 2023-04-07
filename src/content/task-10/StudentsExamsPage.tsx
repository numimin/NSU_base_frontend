import { useState, useEffect } from "react";
import { Student, StudentsExamsQuery, getStudentsByExams, getTeachersByExams } from "../../api/nsu_base";
import Students from "../task-01/Students";
import StudentForm from "./StudentForm";

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

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getStudentsByExams(query, controller.signal);
			if (response !== null) {
				setStudents(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

    return <>
        <StudentForm query={query} onChange={setQuery}/>
        <Students students={students}/>
    </>;
}

export default StudentsExamsPage;   