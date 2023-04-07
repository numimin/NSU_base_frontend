import { useEffect, useState } from "react";
import { Group, Lesson, getGroup } from "../../api/nsu_base";

function LessonCheckbox(props: {lesson: Lesson, lessonIds: number[] | null, onChange: (lessonIds: number[]) => void}) {
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

export default LessonCheckbox;