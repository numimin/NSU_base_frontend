import {useState, useEffect} from 'react';
import {Faculty, Department, getDepartments, getFaculties} from '../../api/nsu_base';

function DissertationsForm(props: {facultyIds: number[], departmentIds: number[], onChange: (facultyIds: number[], departmentIds: number[]) => void}) {
	const [facultyIds, setFacultyIds] = useState<number[]>(props.facultyIds);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [departmentIds, setDepartmentIds] = useState<number[]>(props.departmentIds);
	const [departments, setDepartments] = useState<Department[] | null>(null);

	const onChange = (params: {
		departmentIds?: number[],
		facultyIds?: number[],
	} = {}) => {
		props.onChange(
			params.facultyIds === undefined ? facultyIds : params.facultyIds,
			params.departmentIds === undefined ? departmentIds : params.departmentIds);
	}

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			if (!facultyIds) return;
			setDepartments(await getDepartments(facultyIds, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [facultyIds]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setFaculties(await getFaculties(controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, []);

	return <form>
		<ol>
		<li>
				{
					faculties && <>
						<h2>Факультеты:</h2>
						<ol>
							{
								faculties.map(faculty => {
									return <li key={faculty.id}>
										<input type="checkbox" 
											   id={`faculty${faculty.id}`} 
											   checked={facultyIds.includes(faculty.id)}
											   onChange={e => {
											   	if (e.target.checked) {
											   		const newFacultyIds = [...facultyIds, faculty.id];
											   		setFacultyIds(newFacultyIds);
											   		onChange({facultyIds: newFacultyIds});
											   	} else {
											   		let newFacultyIds = [...facultyIds];
											   		const index = newFacultyIds.indexOf(faculty.id);
											   		if (index !== -1) {
											   			newFacultyIds.splice(index, 1)
											   			setFacultyIds(newFacultyIds);
											   			onChange({facultyIds: newFacultyIds});
											   		}
											   	}
											   }}/>
										<label htmlFor={`faculty${faculty.id}`}>{faculty.name}</label>
									</li>
								})
							}
						</ol>
					</>
				}
			</li>
			<li>
				{
					departments && <>
						<h2>Кафедры:</h2>
						<ol>
							{
								departments.map(department => {
									return <li key={department.id}>
										<input type="checkbox" 
											   id={`department${department.id}`} 
											   checked={departmentIds.includes(department.id)}
											   onChange={e => {
											   	if (e.target.checked) {
											   		const newDepartmentIds = [...departmentIds, department.id];
											   		setDepartmentIds(newDepartmentIds);
											   		onChange({departmentIds: newDepartmentIds});
											   	} else {
											   		let newDepartmentIds = [...departmentIds];
											   		const index = newDepartmentIds.indexOf(department.id);
											   		if (index !== -1) {
											   			newDepartmentIds.splice(index, 1)
											   			setDepartmentIds(newDepartmentIds);
											   			onChange({departmentIds: newDepartmentIds});
											   		}
											   	}
											   }}/>
										<label htmlFor={`group${department.id}`}>{department.name}</label>
									</li>
								})
							}
						</ol>
					</>
				}
			</li>
		</ol>
	</form>;
}

export default DissertationsForm;