import {useState, useEffect} from 'react';
import {StudentQuery, Gender, SBoolean, Group, getGroups, Faculty, getFaculties} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import { IdCheckbox, convertToItem } from '../forms/IdCheckbox';
import { Select } from '../forms/Select';

function StudentsForm(props: {query: StudentQuery, onChange: (query: StudentQuery) => void}) {
	const [gender, setGender] = useState<Gender>(props.query.gender);
	const [year, setYear] = useState<number | null>(props.query.year);
	const [age, setAge] = useState<number | null>(props.query.age);
	const [hasChildren, setHasChildren] = useState<SBoolean>(props.query.hasChildren);
	const [minScholarship, setMinScholarship] = useState<number | null>(props.query.minScholarship);
	const [maxScholarship, setMaxScholarship] = useState<number | null>(props.query.maxScholarship);
	const [facultyIds, setFacultyIds] = useState<number[]>(props.query.facultyIds);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [groupIds, setGroupIds] = useState<number[]>(props.query.groupIds);
	const [groups, setGroups] = useState<Group[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);

	const onChange = (params: {
		gender?: Gender,
		year?: number | null,
		age?: number | null,
		hasChildren?: SBoolean,
		minScholarship?: number | null,
		maxScholarship?: number | null,
		groupIds?: number[],
		facultyIds?: number[],
	} = {}) => {
		props.onChange({
			gender: params.gender || gender,
			year: params.year === undefined ? year : params.year,
			age: params.age === undefined ? age : params.age,
			hasChildren: params.hasChildren || hasChildren,
			minScholarship: params.minScholarship === undefined ? minScholarship : params.minScholarship,
			maxScholarship: params.maxScholarship === undefined ? maxScholarship : params.maxScholarship,
			groupIds: params.groupIds === undefined ? groupIds : params.groupIds,
			facultyIds: params.facultyIds === undefined ? facultyIds : params.facultyIds,
		});
	}

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroups(await getGroups(facultyIds, controller.signal));
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
			<Select name="Пол"
					options={[{name: "Не указан", value: "NONE"},
							  {name: "Мужской", value: "MALE"},
							  {name: "Женский", value: "FEMALE"}]} 
					value={gender}
					onChange={value => {
						setGender(value as Gender);
						onChange({gender: value as Gender});
					}}/>
			<li>
				<CheckedInput name="Год рождения" value={year} onChange={newYear => {
					setYear(newYear);
					onChange({year: newYear});
				}}/>
			</li>
			<li>
				<CheckedInput name="Возраст" value={age} onChange={newAge => {
					setAge(newAge);
					onChange({age: newAge});
				}}/>
			</li>
			<Select name="Дети"
					options={[{name: "Не указано", value: "NONE"},
							  {name: "Есть", value: "TRUE"},
							  {name: "Нет", value: "FALSE"}]} 
					value={gender}
					onChange={value => {
						setHasChildren(value as SBoolean);
						onChange({hasChildren: value as SBoolean});
					}}/>
			<li>
				<CheckedInput name="Стипендия >= " value={minScholarship} onChange={newMinScholarship => {
					setMinScholarship(newMinScholarship);
					onChange({minScholarship: newMinScholarship});
				}}/>
			</li>
			<li>
				<CheckedInput name="Стипендия <= " value={maxScholarship} onChange={newMaxScholarship => {
					setMaxScholarship(newMaxScholarship);
					onChange({maxScholarship: newMaxScholarship});
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
				name="Группы"
				items={groups?.map(convertToItem)}
				ids={groupIds}
				setIds={newIds => {
					setGroupIds(newIds);
					onChange({groupIds: newIds});
				}}
				callback={() => setFirstVisible(true)}
				/>
		</ol>
	</form>;
}

export {
	StudentsForm,
}