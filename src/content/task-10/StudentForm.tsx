import { useEffect, useState } from "react";
import { DateStruct, Group, Lesson, StudentsExamsQuery, Teacher, getGroups, getLessonsPost, getTeachers } from "../../api/nsu_base";
import CheckedInput from "../forms/CheckedInput";
import { IdCheckbox, IdRadio, convertToItem, convertToItemWithFunction } from "../forms/IdCheckbox";
import LessonCheckbox from "../forms/LessonCheckbox";
import DateForm from "../forms/DateForm";

function StudentForm(props: {query: StudentsExamsQuery, onChange: (query: StudentsExamsQuery) => void}) {
    const [teacherId, setTeacherId] = useState<number | null>(props.query.teacherId);
    const [mark, setMark] = useState<number | null>(props.query.mark);
    const [groupIds, setGroupIds] = useState<number[] | null>(props.query.groupIds);
    const [lessonIds, setLessonIds] = useState<number[] | null>(props.query.lessonIds);
    const [terms, setTerms] = useState<number[] | null>(props.query.terms);
    const [start, setStart] = useState<DateStruct | null>(props.query.start);
    const [end, setEnd] = useState<DateStruct | null>(props.query.end);

    const [teachers, setTeachers] = useState<Teacher[] | null>(null);
    const [groups, setGroups] = useState<Group[] | null>(null);
    const [lessons, setLessons] = useState<Lesson[] | null>(null);
    const allTerms = [1, 2, 3, 4, 5, 6, 7, 8];
    
    const onChange = (params: {
        teacherId?: number | null,
        mark?: number | null,
        groupIds?: number[] | null,
        lessonIds?: number[] | null,
        terms?: number[] | null,
        start?: DateStruct | null,
        end?: DateStruct | null,
    } = {}) => {
        props.onChange({
            teacherId: params.teacherId === undefined ? teacherId : params.teacherId,
            mark: params.mark === undefined ? mark : params.mark,
            groupIds: params.groupIds === undefined ? groupIds : params.groupIds,
            lessonIds: params.lessonIds === undefined ? lessonIds : params.lessonIds,
            terms: params.terms === undefined ? terms : params.terms,
            start: params.start === undefined ? start : params.start,
            end: params.end === undefined ? end : params.end,
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

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setTeacherId(null);
			setTeachers(await getTeachers({
                category: "NONE", 
                gender: "NONE", 
                hasChildren: "NONE", 
                minSalary: null, 
                maxSalary: null, 
                graduateStudent: "NONE",
                facultyIds: [],
                departmentIds: [],
                phdThesisStartDate: null,
                phdThesisEndDate: null,
            }, controller.signal));
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
            <IdRadio
				name="Преподаватели:"
				items={teachers?.map(t => convertToItemWithFunction(t, tt => `${tt.firstname} ${tt.lastname} ${tt.patronymic}`))}
				id={teacherId}
				setId={newId => {
					setTeacherId(newId);
					onChange({teacherId: newId});
				}}
				/>
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
            <IdCheckbox 
				name="Семестры:"
				items={allTerms?.map(m => {
					return {id: m, name: m + ""};
				})}
				ids={terms}
				setIds={newIds => {
					setTerms(newIds);
					onChange({terms: newIds});
				}}
				/>
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

export default StudentForm;