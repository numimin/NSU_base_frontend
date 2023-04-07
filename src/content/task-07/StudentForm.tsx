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
		(async () => {
			setLessonId(null);
			setLessons(await getLessonsPost(groupIds, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [groupIds]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setGroupIds(null);
			setGroups(await getGroups([], controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, []);

	return <form className='Form'>
		<ol>
			<li>
				<CheckedInput name="Оценка" value={mark} onChange={newMark => {
					setMark(newMark);
					onChange({mark: newMark});
				}}/>
			</li>
			<li>
				{
				lessons && <>
					<h2>Занятия:</h2>
					<ol>
						{
							lessons.map(lesson => {
								return <LessonView lesson={lesson} lessonId={lessonId} onChange={newId => {
									setLessonId(newId);
			   						onChange({lessonId: newId});
								}}/>
								})
							}
						</ol>
					</>
				}
			</li>
			<IdCheckbox 
				name="Группы:"
				items={groups?.map(convertToItem)}
				ids={groupIds}
				setIds={newIds => {
					setGroupIds(newIds);
					onChange({groupIds: newIds});
				}}
				/>
		</ol>
	</form>;
}

export default StudentForm;