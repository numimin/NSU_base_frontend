import { queries } from "@testing-library/react";
import { Faculty, StudentsOfCourseWithMarksQuery, getFaculties, getGroups } from "../../api/nsu_base";
import {useState, useEffect} from 'react';
import CheckedInput from "../forms/CheckedInput";

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
            <li>
                <ol>
                    {
                        allMarks.map(mark => {
                            return <li key={mark}>
                                <input type="checkbox"
                                    id={`mark${mark}`}
                                    checked={marks?.includes(mark)}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            let newMarks = [mark];
                                            if (marks) {
                                                newMarks = [...marks, mark]
                                            }
                                            setMarks(newMarks);
                                            onChange({marks: newMarks});
                                        } else {
                                            let newMarks = [mark];
                                            if (marks) {
                                                newMarks = [...marks]
                                            }
                                            const index = newMarks.indexOf(mark);
                                            if (index !== -1) {
                                                newMarks.splice(index, 1)
                                                setMarks(newMarks);
                                                onChange({marks: newMarks});
                                            }
                                        }}
                                    }/>
                                    <label htmlFor={`mark${mark}`}>{mark}</label>
                            </li>
                        })
                    }
                </ol>
            </li>
            <li>
				{
				faculties && <>
					<h2>Факультеты:</h2>
					<ol>
						{
							faculties.map(faculty => {
								return <li key={faculty.id}>
										<input type="radio" 
										   id={`faculty${faculty.id}`} 
										   checked={facultyId === faculty.id}
										   onChange={e => {
										   	if (e.target.checked) {
										   		setFacultyId(faculty.id);
										   		onChange({facultyId: faculty.id});
										   	}
										   }}/>
										<label htmlFor={`faculty${faculty.id}`}>{faculty.name}</label>
									</li>
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