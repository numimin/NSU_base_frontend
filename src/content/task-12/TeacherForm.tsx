import { useEffect, useState } from "react";
import { TeachersGraduateWorksQuery, Category, Department, Faculty, getDepartments, getFaculties } from "../../api/nsu_base";
import { IdRadio, convertToItem } from "../forms/IdCheckbox";

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
            <li>
				<label htmlFor="category">Категория</label>
				<select id="category" value={category} onChange={e => {
					setCategory(e.target.value as Category);
					onChange({category: e.target.value as Category});
				}}>
					<option value="NONE">Не указана</option>
					<option value="ASSISTANT">Ассистент</option>
					<option value="ASSISTANT_PROFESSOR">Доцент</option>
					<option value="PROFESSOR">Профессор</option>
				</select>
			</li>
            <IdRadio
				name="Кафедры:"
				items={departments?.map(convertToItem)}
				id={departmentId}
				setId={newId => {
					setDepartmentId(newId);
					onChange({departmentId: newId});
				}}
				/>
            <IdRadio 
				name="Факультеты:"
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