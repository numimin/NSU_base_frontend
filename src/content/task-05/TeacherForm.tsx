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
		(async () => {
			setLessonId(null);
			setLessons(await getLessons({groupId: groupId, course: course}, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [groupId, course]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setGroupId(null);
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
			setFacultyId(null);
			setFaculties(await getFaculties(controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, []);

	return <form className='Form'>
		<ol>
			<li>
				<CheckedInput name="Курс" value={course} onChange={newCourse => {
					setCourse(newCourse);
					onChange({course: newCourse});
				}}/>
			</li>
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
				{
				lessons && <>
					<h2>Занятия:</h2>
					<ol>
						{
							lessons.map(lesson => {
								return <LessonView key={lesson.id} lesson={lesson} lessonId={lessonId} onChange={newId => {
									setLessonId(newId);
			   						onChange({lessonId: newId});
								}}/>
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