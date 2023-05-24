import {useState, useEffect} from 'react';
import {TeachersQuery, Category, Gender, SBoolean, DateStruct, Faculty, Department, getDepartments, getFaculties} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import DateForm from '../forms/DateForm';
import { IdCheckbox, convertToItem } from '../forms/IdCheckbox';
import { Select } from '../forms/Select';

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
	const [firstVisible, setFirstVisible] = useState(false);

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
		if (firstVisible) {
			(async () => {
				if (!facultyIds) return;
				setDepartments(await getDepartments(facultyIds, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [facultyIds, firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

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
			<Select name="Пол"
					options={[{name: "Не указан", value: "NONE"},
				{name: "Мужской", value: "MALE"},
				{name: "Женский", value: "FEMALE"}]}
					value={gender}
					onChange={value => {
						setGender(value as Gender);
						onChange({gender: value as Gender});
					}}/>
			<Select name="Дети"
					options={[{name: "Не указано", value: "NONE"},
				{name: "Есть", value: "TRUE"},
				{name: "Нет", value: "FALSE"}]}
					value={hasChildren}
					onChange={value => {
						setHasChildren(value as SBoolean);
						onChange({hasChildren: value as SBoolean});
					}}/>
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
			<Select name="Обучается в аспирантуре"
					options={[{name: "Не указано", value: "NONE"},
				{name: "Да", value: "TRUE"},
				{name: "Нет", value: "FALSE"}]}
					value={graduateStudent}
					onChange={value => {
						setGraduateStudent(value as SBoolean);
						onChange({graduateStudent: value as SBoolean});
					}}/>
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
			<IdCheckbox
				name="Факультеты"
				items={faculties?.map(convertToItem)}
				ids={facultyIds}
				setIds={newIds => {
					setFacultyIds(newIds);
					onChange({facultyIds: newIds});
				}}
				callback={() => setFirstVisible(true)}
				/>
			<IdCheckbox 
				name="Кафедры"
				items={departments?.map(convertToItem)}
				ids={departmentIds}
				setIds={newIds => {
					setDepartmentIds(newIds);
					onChange({departmentIds: newIds});
				}}
				callback={() => setFirstVisible(true)}
				/>
		</ol>
	</form>;
}

export default TeacherForm;