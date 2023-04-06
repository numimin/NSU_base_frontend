import { queries } from "@testing-library/react";
import { Faculty, StudentsOfCourseWithMarksQuery, getFaculties, getGroups } from "../../api/nsu_base";
import {useState, useEffect} from 'react';
import CheckedInput from "../forms/CheckedInput";
import { IdCheckbox, IdRadio, Item, convertToItem } from "../forms/IdCheckbox";

function StudentForm(props: {query: StudentsOfCourseWithMarksQuery, onChange: (query: StudentsOfCourseWithMarksQuery) => void}) {
    const [course, setCourse] = useState<number | null>(props.query.course);
    const [term, setTerm] = useState<number | null>(props.query.term);
    const [marks, setMarks] = useState<number[] | null>(props.query.marks);
    const [facultyId, setFacultyId] = useState<number | null>(props.query.facultyId);
    const [groupIds, setGroupIds] = useState<number[] | null>(props.query.groupIds);
    const [faculties, setFaculties] = useState<Faculty[] | null>(null);
    const [groups, setGroups] = useState<Faculty[] | null>(null);
    const allMarks = [2, 3, 4, 5];

	const onChange = (params: {
        course?: number | null,
        term?: number | null,
        facultyId?: number | null,
		groupIds?: number[] | null,
		marks?: number[] | null,
	} = {}) => {
		props.onChange({
            course: params.course === undefined ? course : params.course,
            term: params.term === undefined ? term : params.term,
            facultyId: params.facultyId === undefined ? facultyId : params.facultyId,
			marks: params.marks === undefined ? marks : params.marks,
			groupIds: params.groupIds === undefined ? groupIds : params.groupIds,
		});			
	}

    useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			setGroupIds(null);
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

    return <form>
        <ol>
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
            <IdCheckbox 
				name="Группы:"
				items={allMarks?.map(m => {
					return {id: m, name: m + ""};
				})}
				ids={marks}
				setIds={newIds => {
					setMarks(newIds);
					onChange({marks: newIds});
				}}
				/>
            <IdRadio 
				name="Факультеты:"
				items={faculties?.map(convertToItem)}
				id={facultyId}
				setId={newId => {
					setFacultyId(newId);
					onChange({facultyId: newId});
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
        </ol>
    </form>;
}

export default StudentForm;