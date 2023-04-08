import { useEffect, useState } from "react";
import { TeachersGraduateWorksQuery, Category, Department, Faculty, getDepartments, getFaculties } from "../../api/nsu_base";
import { IdRadio, convertToItem } from "../forms/IdCheckbox";
import { Select } from "../forms/Select";

function TeacherForm(props: {query: TeachersGraduateWorksQuery, onChange: (query: TeachersGraduateWorksQuery) => void}) {
    const [departmentId, setDepartmentId] = useState<number | null>(props.query.departmentId);
    const [facultyId, setFacultyId] = useState<number | null>(props.query.facultyId);
    const [category, setCategory] = useState<Category>(props.query.category);
    
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [faculties, setFaculties] = useState<Faculty[] | null>(null);

    const onChange = (params: {
        departmentId?: number | null,
        facultyId?: number | null,
        category?: Category,
    } = {}) => {
        props.onChange({
            departmentId: params.departmentId === undefined ? departmentId : params.departmentId,
            facultyId: params.facultyId === undefined ? facultyId : params.facultyId,
            category: params.category === undefined ? category : params.category,
        });
    };

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setDepartmentId(null);
			setDepartments(await getDepartments(facultyId ? [facultyId] : [], controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [facultyId]);

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setFacultyId(null);
			setFaculties(await getFaculties(controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, []);

    return <form className='Form'>
        <ol>
			<Select name="Категория"
					options={[{name: "Не указана", value: "NONE"},
				{name: "Ассистент", value: "ASSISTANT"},
				{name: "Доцент", value: "ASSISTANT_PROFESSOR"},
				{name: "Профессор", value: "PROFESSOR"}]}
					value={category}
					onChange={value => {
						setCategory(value as Category);
						onChange({category: value as Category});
					}}/>
            <IdRadio
				name="Кафедры"
				items={departments?.map(convertToItem)}
				id={departmentId}
				setId={newId => {
					setDepartmentId(newId);
					onChange({departmentId: newId});
				}}
				/>
            <IdRadio 
				name="Факультеты"
				items={faculties?.map(convertToItem)}
				id={facultyId}
				setId={newId => {
					setFacultyId(newId);
					onChange({facultyId: newId});
				}}
				/>
        </ol>
    </form>;
}

export default TeacherForm;