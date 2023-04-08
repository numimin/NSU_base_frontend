import { useEffect, useState } from "react";
import { Group, Lesson, TeachersExamsQuery, getGroup, getGroups, getLessons, getLessonsPost } from "../../api/nsu_base";
import CheckedInput from "../forms/CheckedInput";
import { IdCheckbox, convertToItem } from "../forms/IdCheckbox";
import LessonCheckbox from "../forms/LessonCheckbox";

function TeacherForm(props: {query: TeachersExamsQuery, onChange: (query: TeachersExamsQuery) => void}) {
    const [term, setTerm] = useState<number | null>(props.query.term);
    const [groupIds, setGroupIds] = useState<number[] | null>(props.query.groupIds);
    const [lessonIds, setLessonIds] = useState<number[] | null>(props.query.lessonIds);
    const [groups, setGroups] = useState<Group[] | null>(null);
    const [lessons, setLessons] = useState<Lesson[] | null>(null);

	const [lessonsVisible, setLessonsVisible] = useState(false);
    
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

    return <form className='Form'>
        <ol>
            <li>
				<CheckedInput name="Семестр" value={term} onChange={newTerm => {
					setTerm(newTerm);
					onChange({term: newTerm});
				}}/>
			</li>
            <IdCheckbox
				name="Группы"
				items={groups?.map(convertToItem)}
				ids={groupIds}
				setIds={newIds => {
					setGroupIds(newIds);
					onChange({groupIds: newIds});
				}}
				/>
            <li className='IdCheckbox'>
				{
				lessons && <>
					<p onClick={e => setLessonsVisible(!lessonsVisible)}>Занятия</p>
					<ol hidden={!lessonsVisible}>
						{
							lessons.map(lesson => {
								return <LessonCheckbox key={lesson.id} lesson={lesson} lessonIds={lessonIds} onChange={newIds => {
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