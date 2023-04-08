import { useState, useEffect } from "react";
import { StudentGraduateWork, StudentsGraduateWorksQuery, getStudentsWithGraduateWorks } from "../../api/nsu_base";
import StudentsGraduateWorks from "./StudentsGraduateWorks";
import StudentGraduateWorkForm from "./StudentGraduateWorkForm";
import Header from "../Header";

function StudentsGraduateWorksPage() {
    const [students, setStudents] = useState<StudentGraduateWork[]>([]);
    const [query, setQuery] = useState<StudentsGraduateWorksQuery>({
        teacherId: null,
        departmentId: null,
    });

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getStudentsWithGraduateWorks(query, controller.signal);
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
            <StudentGraduateWorkForm query={query} onChange={setQuery}/>
            <StudentsGraduateWorks students={students}/>
        </div>
    </>;
}

export default StudentsGraduateWorksPage;   