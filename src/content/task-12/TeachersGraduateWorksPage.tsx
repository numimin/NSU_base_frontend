import { useState, useEffect } from "react";
import { Teacher, TeachersExamsQuery, TeachersGraduateWorksQuery, getTeachersByExams, getTeachersByGraduateWorks } from "../../api/nsu_base";
import Teachers from "../task-02/Teachers";
import TeacherForm from "./TeacherForm";
import Header from "../Header";

function TeachersGraduateWorksPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [query, setQuery] = useState<TeachersGraduateWorksQuery>({
        departmentId: null,
        facultyId: null,
        category: "NONE",
    });

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getTeachersByGraduateWorks(query, controller.signal);
			if (response !== null) {
				setTeachers(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

    return <>
        <Header/>
        <div className='Split'>
            <TeacherForm query={query} onChange={setQuery}/>
            <Teachers teachers={teachers}/>
        </div>
    </>;
}

export default TeachersGraduateWorksPage;