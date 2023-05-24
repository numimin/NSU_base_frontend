import {useState, useEffect} from 'react';
import {TeacherLessonsQuery, Group, Lesson, Faculty, getGroups, getFaculties, getLessons, getGroup} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import LessonView from '../forms/LessonView';
import { IdRadio, convertToItem } from '../forms/IdCheckbox';

function TeacherForm(props: {query: TeacherLessonsQuery, onChange: (query: TeacherLessonsQuery) => void}) {
	const [groupId, setGroupId] = useState<number | null>(props.query.groupId);
	const [course, setCourse] = useState<number | null>(props.query.course);
	const [lessonId, setLessonId] = useState<number | null>(props.query.lessonId);
	const [facultyId, setFacultyId] = useState<number | null>(props.query.facultyId);
	const [groups, setGroups] = useState<Group[] | null>(null);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [lessons, setLessons] = useState<Lesson[] | null>(null);

	const [lessonsVisible, setLessonsVisible] = useState(false);
	const [firstVisible, setFirstVisible] = useState(false);

	const onChange = (params: {
		groupId?: number | null,
		facultyId?: number | null,
		lessonId?: number | null,
		course?: number | null,
	} = {}) => {
		props.onChange({
			course: params.course === undefined ? course : params.course,
			groupId: params.groupId === undefined ? groupId : params.groupId,
			facultyId: params.facultyId === undefined ? facultyId : params.facultyId,
			lessonId: params.lessonId === undefined ? lessonId : params.lessonId,
		});			
	}

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setLessonId(null);
				setLessons(await getLessons({groupId: groupId, course: course}, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, groupId, course]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroupId(null);
				if (facultyId) {
					setGroups(await getGroups([facultyId], controller.signal));
				} else {
					setGroups(await getGroups([], controller.signal));
				}
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, facultyId]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setFacultyId(null);
				setFaculties(await getFaculties(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	return <form className='Form'>
		<ol>
			<li>
				<CheckedInput name="Курс" value={course} onChange={newCourse => {
					setCourse(newCourse);
					onChange({course: newCourse});
				}}/>
			</li>
			<IdRadio 
				name="Факультеты"
				items={faculties?.map(convertToItem)}
				id={facultyId}
				setId={newId => {
					setFacultyId(newId);
					onChange({facultyId: newId});
				}}
				callback={() => setFirstVisible(true)}
				/>
			<IdRadio 
				name="Группы"
				items={groups?.map(convertToItem)}
				id={groupId}
				setId={newId => {
					setGroupId(newId);
					onChange({groupId: newId});
				}}
				callback={() => setFirstVisible(true)}
				/>
			<li className='IdCheckbox'>
				{
				 <>
					<p onClick={e => {setLessonsVisible(!lessonsVisible); setFirstVisible(true)}}>Занятия</p>
					<ol hidden={!lessonsVisible}>
						{
							lessons ? lessons.map(lesson => {
								return <LessonView key={lesson.id} lesson={lesson} lessonId={lessonId} onChange={newId => {
									setLessonId(newId);
			   						onChange({lessonId: newId});
								}}/>
								})
								: <p>Идет загрузка...</p>
							}
						</ol>
					</>
				}
			</li>
		</ol>
	</form>;
}

export default TeacherForm;