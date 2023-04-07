import {useState, useEffect} from 'react';
import {Faculty, Department, getDepartments, getFaculties} from '../../api/nsu_base';
import { IdCheckbox, convertToItem } from '../forms/IdCheckbox';

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

	return <form className='Form'>
		<ol>
		<IdCheckbox 
				name="Факультеты:"
				items={faculties?.map(convertToItem)}
				ids={facultyIds}
				setIds={newIds => {
					setFacultyIds(newIds);
					onChange({facultyIds: newIds});
				}}
				/>
			<IdCheckbox 
				name="Кафедры:"
				items={departments?.map(convertToItem)}
				ids={departmentIds}
				setIds={newIds => {
					setDepartmentIds(newIds);
					onChange({departmentIds: newIds});
				}}
				/>
		</ol>
	</form>;
}

export default DissertationsForm;