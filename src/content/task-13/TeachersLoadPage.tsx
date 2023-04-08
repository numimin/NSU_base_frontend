import { useState, useEffect } from "react";
import { StudentGraduateWork, StudentsGraduateWorksQuery, getStudentsWithGraduateWorks, Load, getTeachersLoad } from "../../api/nsu_base";
import StudentGraduateWorkForm from "../task-11/StudentGraduateWorkForm";
import LoadView from "./LoadView";
import Header from "../Header";

function TeachersLoadPage() {
    const [load, setLoad] = useState<Load>({
        lessons: [],
        types: [],
    });
    const [query, setQuery] = useState<StudentsGraduateWorksQuery>({
        teacherId: null,
        departmentId: null,
    });

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getTeachersLoad(query, controller.signal);
			if (response !== null) {
				setLoad(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [query]);

    return <>
        <Header/>
        <div className='Split'>
            <StudentGraduateWorkForm query={query} onChange={setQuery}/>
            <LoadView load={load}/>
        </div>
    </>;
}

export default TeachersLoadPage;   