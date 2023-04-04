import {useState, useEffect} from 'react';
import {TeachersQuery, Category, Gender, SBoolean, DateStruct, Faculty, Department, getDepartments, getFaculties} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import DateForm from '../forms/DateForm';

function TeacherForm(props: {query: TeachersQuery, onChange: (query: TeachersQuery) => void}) {
	const [category, setCategory] = useState<Category>(props.query.category);
	const [gender, setGender] = useState<Gender>(props.query.gender);
	const [hasChildren, setHasChildren] = useState<SBoolean>(props.query.hasChildren);
	const [minSalary, setMinSalary] = useState<number | null>(props.query.minSalary);
	const [maxSalary, setMaxSalary] = useState<number | null>(props.query.maxSalary);
	const [graduateStudent, setGraduateStudent] = useState<SBoolean>(props.query.graduateStudent);
	const [phdThesisStartDate, setPhdThesisStartDate] = useState<DateStruct | null>(props.query.phdThesisStartDate);
	const [phdThesisEndDate, setPhdThesisEndDate] = useState<DateStruct | null>(props.query.phdThesisEndDate);
	const [facultyIds, setFacultyIds] = useState<number[]>(props.query.facultyIds);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [departmentIds, setDepartmentIds] = useState<number[]>(props.query.departmentIds);
	const [departments, setDepartments] = useState<Department[] | null>(null);

	const onChange = (params: {
		category?: Category,
		gender?: Gender,
		hasChildren?: SBoolean,
		minSalary?: number | null,
		maxSalary?: number | null,
		graduateStudent?: SBoolean,
		phdThesisStartDate?: DateStruct | null,
		phdThesisEndDate?: DateStruct | null,
		departmentIds?: number[],
		facultyIds?: number[],
	} = {}) => {
		props.onChange({
			category: params.category || category,
			gender: params.gender || gender,
			hasChildren: params.hasChildren || hasChildren,
			minSalary: params.minSalary === undefined ? minSalary : params.minSalary,
			maxSalary: params.maxSalary === undefined ? maxSalary : params.maxSalary,
			graduateStudent: params.graduateStudent || graduateStudent,
			phdThesisStartDate: params.phdThesisStartDate === undefined ? phdThesisStartDate : params.phdThesisStartDate,
			phdThesisEndDate: params.phdThesisEndDate === undefined ? phdThesisEndDate : params.phdThesisEndDate,
			facultyIds: params.facultyIds === undefined ? facultyIds : params.facultyIds,
			departmentIds: params.departmentIds === undefined ? departmentIds : params.departmentIds
		});
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
			<li>
				<label htmlFor="gender">Пол</label>
				<select id="gender" value={gender} onChange={e => {
					setGender(e.target.value as Gender);
					onChange({gender: e.target.value as Gender});
				}}>
					<option value="NONE">Не указан</option>
					<option value="MALE">Мужской</option>
					<option value="FEMALE">Женский</option>
				</select>
			</li>
			<li>
				<label htmlFor="children">Дети</label>
				<select id="children" value={hasChildren} onChange={e => {
					setHasChildren(e.target.value as SBoolean);
					onChange({hasChildren: e.target.value as SBoolean});
				}}>
					<option value="NONE">Не указано</option>
					<option value="TRUE">Есть</option>
					<option value="FALSE">Нет</option>
				</select>
			</li>
			<li>
				<CheckedInput name="Зарплата >= " value={minSalary} onChange={newMinSalary => {
					setMinSalary(newMinSalary);
					onChange({minSalary: newMinSalary});
				}}/>
			</li>
			<li>
				<CheckedInput name="Зарплата <= " value={maxSalary} onChange={newMaxSalary => {
					setMaxSalary(newMaxSalary);
					onChange({maxSalary: newMaxSalary});
				}}/>
			</li>
			<li>
				<label htmlFor="graduateStudent">Обучается в аспирантуре</label>
				<select id="graduateStudent" value={graduateStudent} onChange={e => {
					setGraduateStudent(e.target.value as SBoolean);
					onChange({graduateStudent: e.target.value as SBoolean});
				}}>
					<option value="NONE">Не указано</option>
					<option value="TRUE">Да</option>
					<option value="FALSE">Нет</option>
				</select>
			</li>
			<li>
				<DateForm name={"Дата защиты >="} onChange={date => {
					setPhdThesisStartDate(date);
					onChange({phdThesisStartDate: date}); 
				}}/>
			</li>
			<li>
				<DateForm name={"Дата защиты <="} onChange={date => {
					setPhdThesisEndDate(date); 
					onChange({phdThesisEndDate: date});
				}}/>
			</li>
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

export default TeacherForm;