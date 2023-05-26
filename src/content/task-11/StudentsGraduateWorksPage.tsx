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
    const [update, setUpdate] = useState(true);

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
        if (update) {
            (async () => {
                const response = await getStudentsWithGraduateWorks(query, controller.signal);
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
            <StudentGraduateWorkForm query={query} onChange={q => {
                setQuery(q);
                setUpdate(true);
            }}/>
            <StudentsGraduateWorks update={() => setUpdate(true)} students={students}/>
        </div>
    </>;
}

export default StudentsGraduateWorksPage;   