import { useEffect, useState } from "react";
import { Group, Lesson, TeachersExamsQuery, getGroup, getGroups, getLessons, getLessonsPost } from "../../api/nsu_base";
import CheckedInput from "../forms/CheckedInput";
import { IdCheckbox, convertToItem } from "../forms/IdCheckbox";

function LessonView(props: {lesson: Lesson, lessonIds: number[] | null, onChange: (lessonIds: number[]) => void}) {
	const [group, setGroup] = useState<Group | null>(null);

	const lesson = props.lesson;

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setGroup(await getGroup(lesson.groupId, controller.signal));
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [lesson]);

	const groupName = group ? " (" + group.name + ")": "";
	return <li key={lesson.id}>
			<input type="checkbox" 
			   id={`faculty${lesson.id}`} 
               checked={props.lessonIds?.includes(lesson.id)}
               onChange={e => {
                    if (e.target.checked) {
                        let newIds = [lesson.id];
                        if (props.lessonIds) {
                            newIds = [...props.lessonIds, lesson.id]
                        }
                        props.onChange(newIds);
                    } else {
                        let newIds = [lesson.id];
                        if (props.lessonIds) {
                            newIds = [...props.lessonIds]
                        }
                        const index = newIds.indexOf(lesson.id);
                        if (index !== -1) {
                            newIds.splice(index, 1);
                            props.onChange(newIds);
                        }
                    }
               }}/>
			<label htmlFor={`faculty${lesson.id}`}>{(lesson.type === "LECTURE" ? "(лек.) " : lesson.type === "PRACTICE" ? "(сем.) " : "(лаб.) ") + lesson.name + groupName}</label>
		</li>;
}

function TeacherForm(props: {query: TeachersExamsQuery, onChange: (query: TeachersExamsQuery) => void}) {
    const [term, setTerm] = useState<number | null>(props.query.term);
    const [groupIds, setGroupIds] = useState<number[] | null>(props.query.groupIds);
    const [lessonIds, setLessonIds] = useState<number[] | null>(props.query.lessonIds);
    const [groups, setGroups] = useState<Group[] | null>(null);
    const [lessons, setLessons] = useState<Lesson[] | null>(null);
    
    const onChange = (params: {
        term?: number | null,
        groupIds?: number[] | null,
        lessonIds?: number[] | null,
    } = {}) => {
        props.onChange({
            term: params.term === undefined ? term : params.term,
            groupIds: params.groupIds === undefined ? groupIds : params.groupIds,
            lessonIds: params.lessonIds === undefined ? lessonIds : params.lessonIds,
        });
    };

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setLessonIds(null);
            if (groupIds) {
                setLessons(await getLessonsPost(groupIds, controller.signal));
            } else {
                setLessons(await getLessonsPost([], controller.signal));
            }
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
				<CheckedInput name="Семестр" value={term} onChange={newTerm => {
					setTerm(newTerm);
					onChange({term: newTerm});
				}}/>
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
            <li>
				{
				lessons && <>
					<h2>Занятия:</h2>
					<ol>
						{
							lessons.map(lesson => {
								return <LessonView key={lesson.id} lesson={lesson} lessonIds={lessonIds} onChange={newIds => {
									setLessonIds(newIds);
			   						onChange({lessonIds: newIds});
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