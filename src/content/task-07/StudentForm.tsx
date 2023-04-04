import {useState, useEffect} from 'react';
import {Student, StudentsWithMarkQuery, getStudentsWithMarks, Group, Lesson, getLessonsPost, getGroups} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import LessonView from '../forms/LessonView';

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

	return <form>
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
											   checked={groupIds ? groupIds.includes(group.id) : false}
											   onChange={e => {
											   	if (e.target.checked) {
											   		let newGroupIds = [group.id];
											   		if (groupIds) {
											   			newGroupIds = [...groupIds, group.id]
											   		}
											   		setGroupIds(newGroupIds);
											   		onChange({groupIds: newGroupIds});
											   	} else {
											   		let newGroupIds = [group.id];
											   		if (groupIds) {
											   			newGroupIds = [...groupIds]
											   		}
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

export default StudentForm;