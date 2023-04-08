import { useEffect, useState } from "react";
import { Department, StudentsGraduateWorksQuery, Teacher, getDepartments, getTeachers } from "../../api/nsu_base";
import { IdRadio, convertToItem, convertToItemWithFunction } from "../forms/IdCheckbox";

function StudentGraduateWorkForm(props: {query: StudentsGraduateWorksQuery, onChange: (query: StudentsGraduateWorksQuery) => void}) {
    const [teacherId, setTeacherId] = useState<number | null>(props.query.teacherId);
    const [departmentId, setDepartmentId] = useState<number | null>(props.query.departmentId);

    const [teachers, setTeachers] = useState<Teacher[] | null>(null);
    const [departments, setDepartments] = useState<Department[] | null>(null);

    const onChange = (params: {
        teacherId?: number | null,
        departmentId?: number | null,
    } = {}) => {
        props.onChange({
            teacherId: params.teacherId === undefined ? teacherId : params.teacherId,
            departmentId: params.departmentId === undefined ? departmentId : params.departmentId,
        });
    }

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setTeacherId(null);
			setTeachers(await getTeachers({
                category: "NONE", 
                gender: "NONE", 
                hasChildren: "NONE", 
                minSalary: null, 
                maxSalary: null, 
                graduateStudent: "NONE",
                facultyIds: [],
                departmentIds: departmentId ? [departmentId] : [],
                phdThesisStartDate: null,
                phdThesisEndDate: null,
            }, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [departmentId]);

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setDepartmentId(null);
			setDepartments(await getDepartments([], controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, []);

    return <form className='Form'>
        <ol>
            <IdRadio
				name="Преподаватели"
				items={teachers?.map(t => convertToItemWithFunction(t, tt => `${tt.firstname} ${tt.lastname} ${tt.patronymic}`))}
				id={teacherId}
				setId={newId => {
					setTeacherId(newId);
					onChange({teacherId: newId});
				}}
				/>
            <IdRadio
				name="Кафедры"
				items={departments?.map(convertToItem)}
				id={departmentId}
				setId={newId => {
					setDepartmentId(newId);
					onChange({departmentId: newId});
				}}
				/>
        </ol>
    </form>;
}

export default StudentGraduateWorkForm;