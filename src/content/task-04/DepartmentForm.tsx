import {useState, useEffect} from 'react';
import {DepartmentLessonQuery, Group, Faculty, getFaculties, getGroups, DateStruct} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import DateForm from '../forms/DateForm';
import { IdRadio, convertToItem } from '../forms/IdCheckbox';

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


	return <form className='Form'>
		<ol>
			<IdRadio 
				name="Факультеты:"
				items={faculties?.map(convertToItem)}
				id={facultyId}
				setId={newId => {
					setFacultyId(newId);
					onChange({facultyId: newId});
				}}
				/>
			<IdRadio 
				name="Группы:"
				items={groups?.map(convertToItem)}
				id={groupId}
				setId={newId => {
					setGroupId(newId);
					onChange({groupId: newId});
				}}
				/>
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
				<DateForm name={"Дата >="} onChange={date => {
					setStart(date); 
					onChange({start: date});
				}}/>
			</li>
			<li>
				<DateForm name={"Дата <="} onChange={date => {
					setEnd(date); 
					onChange({end: date});
				}}/>
			</li>
		</ol>
	</form>;
}

export default DepartmentForm;
