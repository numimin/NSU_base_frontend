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
    const [update, setUpdate] = useState(true);

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
        if (update) {
            (async () => {
                const response = await getTeachersByGraduateWorks(query, controller.signal);
                if (response !== null) {
                    setTeachers(response);				
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
            <TeacherForm query={query} onChange={q => {
                setQuery(q);
                setUpdate(true);
            }}/>
            <Teachers update={() => setUpdate(true)} teachers={teachers}/>
        </div>
    </>;
}

export default TeachersGraduateWorksPage;