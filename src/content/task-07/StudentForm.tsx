import {useState, useEffect} from 'react';
import {Student, StudentsWithMarkQuery, getStudentsWithMarks, Group, Lesson, getLessonsPost, getGroups} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import LessonView from '../forms/LessonView';
import { IdCheckbox, convertToItem } from '../forms/IdCheckbox';

function StudentForm(props: {query: StudentsWithMarkQuery, onChange: (query: StudentsWithMarkQuery) => void}) {
	const [lessonId, setLessonId] = useState<number | null>(props.query.lessonId);
	const [mark, setMark] = useState<number | null>(props.query.mark);
	const [groupIds, setGroupIds] = useState<number[] | null>(props.query.groupIds);
	const [groups, setGroups] = useState<Group[] | null>(null);
	const [lessons, setLessons] = useState<Lesson[] | null>(null);

	const [lessonsVisible, setLessonsVisible] = useState(false);
	const [firstVisible, setFirstVisible] = useState(false);

	const onChange = (params: {
		groupIds?: number[] | null,
		lessonId?: number | null,
		mark?: number | null,
	} = {}) => {
		props.onChange({
			mark: params.mark === undefined ? mark : params.mark,
			lessonId: params.lessonId === undefined ? lessonId : params.lessonId,
			groupIds: params.groupIds === undefined ? groupIds : params.groupIds,
		});			
	}

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setLessonId(null);
				setLessons(await getLessonsPost(groupIds, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, groupIds]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroupIds(null);
				setGroups(await getGroups([], controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	return <form className='Form'>
		<ol>
			<li>
				<CheckedInput name="Оценка" value={mark} onChange={newMark => {
					setMark(newMark);
					onChange({mark: newMark});
				}}/>
			</li>
			<li className='IdCheckbox'>
				{
				<>
					<p onClick={e => {setLessonsVisible(!lessonsVisible); setFirstVisible(true)}}>Занятия</p>
					<ol hidden={!lessonsVisible}>
						{
							lessons ? lessons.map(lesson => {
								return <LessonView lesson={lesson} lessonId={lessonId} onChange={newId => {
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

export default StudentForm;