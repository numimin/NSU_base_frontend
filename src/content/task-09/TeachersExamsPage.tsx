import { useState, useEffect } from "react";
import { Teacher, TeachersExamsQuery, getTeachersByExams } from "../../api/nsu_base";
import Teachers from "../task-02/Teachers";
import TeacherForm from "./TeacherForm";
import Header from "../Header";

function TeachersExamsPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [query, setQuery] = useState<TeachersExamsQuery>({
        term: null,
        groupIds: null,
        lessonIds: null,
    });

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getTeachersByExams(query, controller.signal);
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

export default TeachersExamsPage;   