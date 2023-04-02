import {useState, useEffect} from 'react';
import {StudentQuery, Gender, SBoolean, Group, getGroups, Faculty, getFaculties} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';

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
		(async () => {
			if (!faculties) return;
			setGroups(await getGroups(facultyIds, controller.signal));
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
			<li>
				{
					faculties && <>
						<h2>Группы:</h2>
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
					groups && <>
						<h2>Группы:</h2>
						<ol>
							{
								groups.map(group => {
									return <li key={group.id}>
										<input type="checkbox" 
											   id={`group${group.id}`} 
											   checked={groupIds.includes(group.id)}
											   onChange={e => {
											   	if (e.target.checked) {
											   		const newGroupIds = [...groupIds, group.id];
											   		setGroupIds(newGroupIds);
											   		onChange({groupIds: newGroupIds});
											   	} else {
											   		let newGroupIds = [...groupIds];
											   		const index = newGroupIds.indexOf(group.id);
											   		if (index !== -1) {
											   			newGroupIds.splice(index, 1)
											   			setGroupIds(newGroupIds);
											   			onChange({groupIds: newGroupIds});
											   		}
											   	}
											   }}/>
										<label htmlFor={`group${group.id}`}>{group.name}</label>
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

export {
	StudentsForm,
}