import {useState, useEffect} from 'react';
import {DepartmentLessonQuery, Group, Faculty, getFaculties, getGroups, DateStruct} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import DateForm from '../forms/DateForm';

function DepartmentForm(props: {query: DepartmentLessonQuery, onChange: (query: DepartmentLessonQuery) => void}) {
	const [groupId, setGroupId] = useState<number | null>(props.query.groupId);
	const [facultyId, setFacultyId] = useState<number | null>(props.query.facultyId);
	const [term, setTerm] = useState<number | null>(props.query.term);
	const [course, setCourse] = useState<number | null>(props.query.course);
	const [start, setStart] = useState<DateStruct | null>(props.query.start);
	const [end, setEnd] = useState<DateStruct | null>(props.query.end);
	const [groups, setGroups] = useState<Group[] | null>(null);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);

	const onChange = (params: {
		groupId?: number | null,
		facultyId?: number | null,
		course?: number | null,
		term?: number | null,
		start?: DateStruct | null,
		end?: DateStruct | null,
	} = {}) => {
		props.onChange({
			course: params.course === undefined ? course : params.course,
			term: params.term === undefined ? term : params.term,
			start: params.start === undefined ? start : params.start,
			end: params.end === undefined ? end : params.end,
			groupId: params.groupId === undefined ? groupId : params.groupId,
			facultyId: params.facultyId === undefined ? facultyId : params.facultyId
		});			
	}

	const createDate = (dateStruct: DateStruct | null) => {
		const date = new Date();
		if (dateStruct) {
			date.setDate(dateStruct.day);
			date.setMonth(dateStruct.month);
			date.setFullYear(dateStruct.year);
		}
		return date;
	}

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			if (facultyId) {
				setGroups(await getGroups([facultyId], controller.signal));
			} else {
				setGroups(await getGroups([], controller.signal));
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [facultyId]);

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
											<input type="radio" 
											   id={`faculty${faculty.id}`} 
											   checked={facultyId === faculty.id}
											   onChange={e => {
											   	if (e.target.checked) {
											   		setFacultyId(faculty.id);
											   		onChange({facultyId: faculty.id});
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
										<input type="radio" 
											   id={`group${group.id}`} 
											   checked={groupId === group.id}
											   onChange={e => {
											   	if (e.target.checked) {
											   		setGroupId(group.id);
											   		onChange({groupId: group.id});
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
			<li>
				<CheckedInput name="Курс" value={course} onChange={newCourse => {
					setCourse(newCourse);
					onChange({course: newCourse});
				}}/>
			</li>
			<li>
				<CheckedInput name="Семестр" value={term} onChange={newTerm => {
					setTerm(newTerm);
					onChange({term: newTerm});
				}}/>
			</li>
			<li>
				<DateForm name={"Дата >="} date={createDate(start)} onChange={date => {
					const newDateStruct = {
						day: date.getDate(),
						month: date.getMonth() + 1,
						year: date.getFullYear()
					};
					setStart(newDateStruct); 
					onChange({start: newDateStruct});
				}}/>
			</li>
			<li>
				<DateForm name={"Дата <="} date={createDate(end)} onChange={date => {
					const newDateStruct = {
						day: date.getDate(),
						month: date.getMonth() + 1,
						year: date.getFullYear()
					};
					setEnd(newDateStruct); 
					onChange({end: newDateStruct});
				}}/>
			</li>
		</ol>
	</form>;
}

export default DepartmentForm;