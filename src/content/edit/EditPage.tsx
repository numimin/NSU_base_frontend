import {useState, useEffect, ReactElement} from 'react';
import Header from '../Header';
import './EditPage.scss';
import DateForm from '../forms/DateForm';
import { Category, DateStruct, Department, Faculty, Gender, Group, Lesson, LessonType, MarkString, SBoolean, Student, StudentGraduateWork, StudentsWithMarkQuery, Teacher, addDepartment, addFaculty, addGroup, addMark, addStudent, addTeacher, addWork, allMarks, deleteDepartment, deleteFaculty, deleteGroup, deleteMark, deleteWork, editDepartment, editFaculty, editGroup, editMark, editWork, getAllStudents, getAllTeachers, getDepartments, getFaculties, getGroups, getLessons, getStudents, getStudentsOfCourseWithMarks, getStudentsWithGraduateWorks, getTeachers, getTeachersByGraduateWorks } from '../../api/nsu_base';
import { Select } from '../forms/Select';
import CheckedInput from '../forms/CheckedInput';
import { IdRadio, convertToItem, convertToItemWithFunction } from '../forms/IdCheckbox';
import { addLesson } from '../../api/nsu_base';
import { deleteLesson } from '../../api/nsu_base';

function AddStudent() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState<DateStruct | null>(null);
    const [gender, setGender] = useState("MALE");
    const [hasChildren, setHasChildren] = useState("FALSE");
    const [scholarship, setScholarship] = useState<number | null>(0);
	const [groupIds, setGroupIds] = useState<number | null>(null);
	const [groups, setGroups] = useState<Group[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroups(await getGroups([], controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Имя должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (surname === "") {
               alert("Фамилия должна быть заполнена");
               setLoadingStudent(false);
               return;
           }
           if (patronymic === "") {
               alert("Отчество должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!dateOfBirth) {
               alert("Дата рождения должна быть заполнена");
               setLoadingStudent(false);
               return;
           }
           if (!scholarship) {
               alert("Размер стипендии должен быть заполнен");
               setLoadingStudent(false);
               return;
           }
           if (!groupIds) {
               alert("Группа должна быть выбрана");
               setLoadingStudent(false);
               return;
           }

           (async () => {
               const response = await addStudent({
                   firstname: name,
                   lastname: surname,
                   patronymic: patronymic,
                   gender: gender as Gender,
                   groupId: groupIds,
                   scholarship: scholarship,
                   hasChildren: hasChildren === "TRUE",
                   dateOfBirth: dateOfBirth
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Фамилия:</strong></label>
                <input value={surname} onChange={e => setSurname(e.target.value)}/>
            </li>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Отчество:</strong></label>
                <input value={patronymic} onChange={e => setPatronymic(e.target.value)}/>
            </li>
            <DateForm className='EditDate' name="Дата рождения" onChange={date => setDateOfBirth(date)}/>
			<Select className='EditSelect' name="Пол"
					options={[{name: "Мужской", value: "MALE"},
							  {name: "Женский", value: "FEMALE"}]} 
					value={gender}
					onChange={value => {
						setGender(value as Gender);
					}}/>
			<Select className="EditSelect" name="Дети"
					options={[{name: "Есть", value: "TRUE"},
							  {name: "Нет", value: "FALSE"}]} 
					value={hasChildren}
					onChange={value => {
						setHasChildren(value as SBoolean);
					}}/>
			<li>
				<CheckedInput className="EditInput" name="Стипендия" min={0} value={scholarship} onChange={newScholarship => {
					setScholarship(newScholarship);
				}}/>
			</li>
			<IdRadio
                className="EditRadio"
				name="Группы"
				items={groups?.map(convertToItem)}
				id={groupIds}
				setId={newIds => {
					setGroupIds(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function AddTeacher() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [category, setCategory] = useState("ASSISTANT");
    const [gender, setGender] = useState("MALE");
    const [hasChildren, setHasChildren] = useState("FALSE");
    const [salary, setSalary] = useState<number | null>(0);
    const [graduateStudent, setGraduateStudent] = useState("FALSE");
    const [phdThesisDate, setPhdThesisDate] = useState<DateStruct | null>(null);
	const [departmentId, setDepartmentId] = useState<number | null>(null);
	const [departments, setDepartments] = useState<Department[] | null>(null);
    const [phdDissertation, setPhdDissertation] = useState<string | null>(null);
    const [doctoralDissertation, setDoctoralDissertation] = useState<string | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setDepartments(await getDepartments([], controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Имя должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (surname === "") {
               alert("Фамилия должна быть заполнена");
               setLoadingStudent(false);
               return;
           }
           if (patronymic === "") {
               alert("Отчество должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!salary) {
               alert("Размер зарплаты должен быть заполнен");
               setLoadingStudent(false);
               return;
           }
           if (!departmentId) {
               alert("Кафедра должна быть выбрана");
               setLoadingStudent(false);
               return;
           }
           if (!(phdDissertation !== null && phdThesisDate !== null)) {
                alert("Если Вы указали дату защиты, укажите диссертацию, и наоборот");
                setLoadingStudent(false)
                return;
           }

           (async () => {
               const response = await addTeacher({
                   firstname: name,
                   lastname: surname,
                   patronymic: patronymic,
                   gender: gender as Gender,
                   departmentId: departmentId,
                   salary: salary,
                   hasChildren: hasChildren === "TRUE",
                   phdThesisDate: phdThesisDate,
                   category: category as Category,
                   graduateStudent: graduateStudent === "TRUE",
                   phdDissertation: phdDissertation,
                   doctoralDissertation: doctoralDissertation
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Фамилия:</strong></label>
                <input value={surname} onChange={e => setSurname(e.target.value)}/>
            </li>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Отчество:</strong></label>
                <input value={patronymic} onChange={e => setPatronymic(e.target.value)}/>
            </li>
            <DateForm className='EditDate' name="Дата защиты" onChange={date => setPhdThesisDate(date)}/>
			<Select className='EditSelect' name="Пол"
					options={[{name: "Мужской", value: "MALE"},
							  {name: "Женский", value: "FEMALE"}]} 
					value={gender}
					onChange={value => {
						setGender(value as Gender);
					}}/>
			<Select className='EditSelect' name="Категория"
				    options={[{name: "Ассистент", value: "ASSISTANT"},
				{name: "Доцент", value: "ASSISTANT_PROFESSOR"},
				{name: "Профессор", value: "PROFESSOR"}]}
					value={category}
					onChange={value => {
						setCategory(value as Category);
					}}/>
			<Select className="EditSelect" name="Дети"
					options={[{name: "Есть", value: "TRUE"},
							  {name: "Нет", value: "FALSE"}]} 
					value={hasChildren}
					onChange={value => {
						setHasChildren(value as SBoolean);
					}}/>
			<Select className="EditSelect" name="Обучается в аспирантуре"
					options={[{name: "Да", value: "TRUE"},
							  {name: "Нет", value: "FALSE"}]} 
					value={graduateStudent}
					onChange={value => {
						setGraduateStudent(value as SBoolean);
					}}/>
			<li>
				<CheckedInput className="EditInput" name="Зарплата" min={0} value={salary} onChange={newScholarship => {
					setSalary(newScholarship);
				}}/>
			</li>
			<IdRadio
                className="EditRadio"
				name="Кафедра"
				items={departments?.map(convertToItem)}
				id={departmentId}
				setId={newIds => {
					setDepartmentId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Кандидатская диссертация:</strong></label>
                <input value={phdDissertation || ""} onChange={e => setPhdDissertation(e.target.value === "" ? null : e.target.value)}/>
            </li>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Докторская диссертация:</strong></label>
                <input value={doctoralDissertation || ""} onChange={e => setDoctoralDissertation(e.target.value === "" ? null : e.target.value)}/>
            </li>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function AddGroup() {
    const [name, setName] = useState("");
    const [date, setDate] = useState<DateStruct | null>(null);
	const [facultyId, setFacultyId] = useState<number | null>(null);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!date) {
                alert("Дата не заполнена");
                setLoadingStudent(false)
                return;
           }
           if (!facultyId) {
            alert("Факультет не выбран");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await addGroup({
                   name: name,
                   facultyId: facultyId,
                   date: date,
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
            <DateForm className='EditDate' name="Дата начала занятий" onChange={date => setDate(date)}/>
			<IdRadio
                className="EditRadio"
				name="Факультет"
				items={faculties?.map(convertToItem)}
				id={facultyId}
				setId={newIds => {
					setFacultyId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function DeleteGroup() {
    const [name, setName] = useState("");
    const [groups, setGroups] = useState<Group[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [groupId, setGroupId] = useState<number | null>(null);
    const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setGroups(await getGroups([], controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
			<IdRadio
                className="EditRadio"
				name="Группа"
				items={groups?.filter(g => {
                    return name === "" || g.name === name;
                }).map(convertToItem)}
				id={groupId}
				setId={newIds => {
					setGroupId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                <button type="button" className={'AddButton'} onClick={e => {
                    (async () => {
                        if (groupId) {
                            const response = await deleteGroup(groupId);
                            alert(response?.message);
                            setUpdate(true); 
                        }
                    })();
                }}>Удалить</button>
            </li>
        </ol>
    </form>;
}

function EditGroup() {
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [date, setDate] = useState<DateStruct | null>(null);
	const [facultyId, setFacultyId] = useState<number | null>(null);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [groups, setGroups] = useState<Group[] | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setGroups(await getGroups([], controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!date) {
                alert("Дата не заполнена");
                setLoadingStudent(false)
                return;
           }
           if (!facultyId) {
            alert("Факультет не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!id) {
            alert("Id must be not null");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await editGroup(id, {
                   name: name,
                   facultyId: facultyId,
                   date: date,
               });
               alert(response?.message);
               setLoadingStudent(false);
               setUpdate(true);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Группа"
				items={groups?.map(convertToItem)}
				id={id}
				setId={newIds => {
					setId(newIds);
                    groups?.filter(g => g.id === newIds).forEach(g => {
                        setName(g.name);
                        setDate(g.date);
                        setFacultyId(g.facultyId);
                    });
				}}
				callback={() => setFirstVisible(true)}
				/>
             {
                id && <div>
                    <li className='TextInput'>
                        <label htmlFor='name'><strong>Имя:</strong></label>
                        <input value={name} onChange={e => setName(e.target.value)}/>
                    </li>
                    <DateForm dateStruct={date || undefined} className='EditDate' name="Дата начала занятий" onChange={date => setDate(date)}/>
                    <IdRadio
                        className="EditRadio"
                        name="Факультет"
                        items={faculties?.map(convertToItem)}
                        id={facultyId}
                        setId={newIds => {
                            setFacultyId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <li className='AddButtonLi'>
                        {
                            loadingStudent ? <div className='AddButton loading'>
                                <img src="/icons/loading.png"/>
                            </div> 
                            : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Изменить" : ""}</button>
                        }
                        
                    </li>
                </div>
             }
        </ol>
    </form>;
}

function AddFaculty() {
    const [name, setName] = useState("");
    const [loadingStudent, setLoadingStudent] = useState(false);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }

           (async () => {
               const response = await addFaculty({
                   name: name,
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function DeleteFaculty() {
    const [name, setName] = useState("");
    const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [facultyId, setFacultyId] = useState<number | null>(null);
    const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
			<IdRadio
                className="EditRadio"
				name="Факультет"
				items={faculties?.filter(g => {
                    return name === "" || g.name === name;
                }).map(convertToItem)}
				id={facultyId}
				setId={newIds => {
					setFacultyId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                <button type="button" className={'AddButton'} onClick={e => {
                    (async () => {
                        if (facultyId) {
                            const response = await deleteFaculty(facultyId);
                            alert(response?.message);
                            setUpdate(true); 
                        }
                    })();
                }}>Удалить</button>
            </li>
        </ol>
    </form>;
}

function EditFaculty() {
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState("");
	const [firstVisible, setFirstVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [faculties, setFaculties] = useState<Faculty[] | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!id) {
            alert("Id must be not null");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await editFaculty(id, {
                   name: name,
               });
               alert(response?.message);
               setLoadingStudent(false);
               setUpdate(true);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Факультет"
				items={faculties?.map(convertToItem)}
				id={id}
				setId={newIds => {
					setId(newIds);
                    faculties?.filter(g => g.id === newIds).forEach(g => {
                        setName(g.name);
                    });
				}}
				callback={() => setFirstVisible(true)}
				/>
             {
                id && <div>
                    <li className='TextInput'>
                        <label htmlFor='name'><strong>Имя:</strong></label>
                        <input value={name} onChange={e => setName(e.target.value)}/>
                    </li>
                    <li className='AddButtonLi'>
                        {
                            loadingStudent ? <div className='AddButton loading'>
                                <img src="/icons/loading.png"/>
                            </div> 
                            : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Изменить" : ""}</button>
                        }
                        
                    </li>
                </div>
             }
        </ol>
    </form>;
}

function AddDepartment() {
    const [name, setName] = useState("");
	const [facultyId, setFacultyId] = useState<number | null>(null);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!facultyId) {
            alert("Факультет не выбран");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await addDepartment({
                   name: name,
                   facultyId: facultyId,
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
			<IdRadio
                className="EditRadio"
				name="Факультет"
				items={faculties?.map(convertToItem)}
				id={facultyId}
				setId={newIds => {
					setFacultyId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function DeleteDepartment() {
    const [name, setName] = useState("");
    const [departments, setDepartments] = useState<Department[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setDepartments(await getDepartments([], controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
			<IdRadio
                className="EditRadio"
				name="Кафедра"
				items={departments?.filter(g => {
                    return name === "" || g.name === name;
                }).map(convertToItem)}
				id={departmentId}
				setId={newIds => {
					setDepartmentId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                <button type="button" className={'AddButton'} onClick={e => {
                    (async () => {
                        if (departmentId) {
                            const response = await deleteDepartment(departmentId);
                            alert(response?.message);
                            setUpdate(true); 
                        }
                    })();
                }}>Удалить</button>
            </li>
        </ol>
    </form>;
}

function EditDepartment() {
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState("");
	const [facultyId, setFacultyId] = useState<number | null>(null);
	const [faculties, setFaculties] = useState<Faculty[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [groups, setDepartments] = useState<Department[] | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setDepartments(await getDepartments([], controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setFaculties(await getFaculties(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!facultyId) {
            alert("Факультет не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!id) {
            alert("Id must be not null");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await editDepartment(id, {
                   name: name,
                   facultyId: facultyId,
               });
               alert(response?.message);
               setLoadingStudent(false);
               setUpdate(true);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Кафедра"
				items={groups?.map(convertToItem)}
				id={id}
				setId={newIds => {
					setId(newIds);
                    groups?.filter(g => g.id === newIds).forEach(g => {
                        setName(g.name);
                        setFacultyId(g.facultyId);
                    });
				}}
				callback={() => setFirstVisible(true)}
				/>
             {
                id && <div>
                    <li className='TextInput'>
                        <label htmlFor='name'><strong>Имя:</strong></label>
                        <input value={name} onChange={e => setName(e.target.value)}/>
                    </li>
                    <IdRadio
                        className="EditRadio"
                        name="Факультет"
                        items={faculties?.map(convertToItem)}
                        id={facultyId}
                        setId={newIds => {
                            setFacultyId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <li className='AddButtonLi'>
                        {
                            loadingStudent ? <div className='AddButton loading'>
                                <img src="/icons/loading.png"/>
                            </div> 
                            : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Изменить" : ""}</button>
                        }
                        
                    </li>
                </div>
             }
        </ol>
    </form>;
}

function AddWork() {
    const [theme, setTheme] = useState("");
	const [teacherId, setTeacherId] = useState<number | null>(null);
	const [teachers, setTeachers] = useState<Teacher[] | null>(null);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [students, setStudents] = useState<Student[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setTeachers(await getAllTeachers(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setStudents(await getAllStudents(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (theme === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!teacherId) {
            alert("Преподаватель не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!studentId) {
            alert("Студент не выбран");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await addWork({
                   theme: theme,
                   teacherId: teacherId,
                   studentId: studentId,
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={theme} onChange={e => setTheme(e.target.value)}/>
            </li>
			<IdRadio
                className="EditRadio"
				name="Преподаватель"
				items={teachers?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
				id={teacherId}
				setId={newIds => {
					setTeacherId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
			<IdRadio
                className="EditRadio"
				name="Студент"
				items={students?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
				id={studentId}
				setId={newIds => {
					setStudentId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function DeleteWork() {
    const [theme, setTheme] = useState("");
    const [works, setWorks] = useState<StudentGraduateWork[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [workId, setWorkId] = useState<number | null>(null);
    const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setWorks(await getStudentsWithGraduateWorks({
                    departmentId: null,
                    teacherId: null
                }, controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={theme} onChange={e => setTheme(e.target.value)}/>
            </li>
			<IdRadio
                className="EditRadio"
				name="Работа"
				items={works?.filter(g => {
                    return theme === "" || g.graduateWorkTheme === theme;
                })
                .map(w => convertToItemWithFunction(w, ww => ww.graduateWorkTheme))}
				id={workId}
				setId={newIds => {
					setWorkId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                <button type="button" className={'AddButton'} onClick={e => {
                    (async () => {
                        if (workId) {
                            const response = await deleteWork(workId);
                            alert(response?.message);
                            setUpdate(true); 
                        }
                    })();
                }}>Удалить</button>
            </li>
        </ol>
    </form>;
}

function EditWork() {
    const [id, setId] = useState<number | null>(null);
    const [theme, setTheme] = useState("");
	const [teacherId, setTeacherId] = useState<number | null>(null);
	const [teachers, setTeachers] = useState<Teacher[] | null>(null);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [students, setStudents] = useState<Student[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [works, setWorks] = useState<StudentGraduateWork[] | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setWorks(await getStudentsWithGraduateWorks({
                    departmentId: null,
                    teacherId: null
                }, controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setTeachers(await getAllTeachers(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setStudents(await getAllStudents(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (theme === "") {
               alert("Название должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!teacherId) {
            alert("Преподаватель не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!studentId) {
            alert("Студент не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!id) {
            alert("Id must be not null");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await editWork(id, {
                   theme: theme,
                   teacherId: teacherId,
                   studentId: studentId,
               });
               alert(response?.message);
               setLoadingStudent(false);
               setUpdate(true);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Работа"
				items={works?.map(w => convertToItemWithFunction(w, ww => ww.graduateWorkTheme))}
				id={id}
				setId={newIds => {
					setId(newIds);
                    works?.filter(g => g.id === newIds).forEach(g => {
                        setTheme(g.graduateWorkTheme);
                        setTeacherId(g.teacherId);
                        setStudentId(g.studentId);
                    });
				}}
				callback={() => setFirstVisible(true)}
				/>
             {
                id && <div>
                    <li className='TextInput'>
                        <label htmlFor='name'><strong>Имя:</strong></label>
                        <input value={theme} onChange={e => setTheme(e.target.value)}/>
                    </li>
                    <IdRadio
                        className="EditRadio"
                        name="Преподаватель"
                        items={teachers?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
                        id={teacherId}
                        setId={newIds => {
                            setTeacherId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <IdRadio
                        className="EditRadio"
                        name="Студент"
                        items={students?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
                        id={studentId}
                        setId={newIds => {
                            setStudentId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <li className='AddButtonLi'>
                        {
                            loadingStudent ? <div className='AddButton loading'>
                                <img src="/icons/loading.png"/>
                            </div> 
                            : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Изменить" : ""}</button>
                        }
                        
                    </li>
                </div>
             }
        </ol>
    </form>;
}

function AddMark() {
    const [mark, setMark] = useState<number | null>(null);
	const [lessonId, setLessonId] = useState<number | null>(null);
	const [lessons, setLessons] = useState<Lesson[] | null>(null);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [students, setStudents] = useState<Student[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [date, setDate] = useState<DateStruct | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setLessons(await getLessons({groupId: null, course: null}, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setStudents(await getAllStudents(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (!mark) {
               alert("Оценка должна быть заполнена");
               setLoadingStudent(false);
               return;
           }
           if (!lessonId) {
            alert("Предмет не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!studentId) {
            alert("Студент не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!date) {
            alert("Дата не заполнена");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await addMark({
                   mark: mark,
                   date: date,
                   lessonId: lessonId,
                   studentId: studentId,
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <CheckedInput className="EditInput" name="Оценка" min={2} max={5} value={mark} onChange={newScholarship => {
                setMark(newScholarship);
            }}/>
            <DateForm dateStruct={date || undefined} className='EditDate' name="Дата начала занятий" onChange={date => setDate(date)}/>
			<IdRadio
                className="EditRadio"
				name="Предмет"
				items={lessons?.map(convertToItem)}
				id={lessonId}
				setId={newIds => {
					setLessonId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
			<IdRadio
                className="EditRadio"
				name="Студент"
				items={students?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
				id={studentId}
				setId={newIds => {
					setStudentId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function DeleteMark() {
    const [marks, setMarks] = useState<MarkString[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [markId, setMarkId] = useState<number | null>(null);
    const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setMarks(await allMarks(controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Оценка"
				items={marks?.map(w => convertToItemWithFunction(w, ww => ww.mark + ", " + ww.lesson + ", " + ww.student))}
				id={markId}
				setId={newIds => {
					setMarkId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                <button type="button" className={'AddButton'} onClick={e => {
                    (async () => {
                        if (markId) {
                            const response = await deleteMark(markId);
                            alert(response?.message);
                            setUpdate(true); 
                        }
                    })();
                }}>Удалить</button>
            </li>
        </ol>
    </form>;
}

function EditMark() {
    const [id, setId] = useState<number | null>(null);
    const [mark, setMark] = useState<number | null>(null);
	const [lessonId, setLessonId] = useState<number | null>(null);
	const [lessons, setLessons] = useState<Lesson[] | null>(null);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [students, setStudents] = useState<Student[] | null>(null);
    const [date, setDate] = useState<DateStruct | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [marks, setMarks] = useState<MarkString[] | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setMarks(await allMarks(controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setLessons(await getLessons({groupId: null, course: null}, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setStudents(await getAllStudents(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (!mark) {
               alert("Оценка должна быть заполнена");
               setLoadingStudent(false);
               return;
           }
           if (!lessonId) {
            alert("Преподаватель не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!studentId) {
            alert("Студент не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!date) {
            alert("Дата не заполнена");
            setLoadingStudent(false);
            return;
           }
           if (!id) {
            alert("Id must be not null");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await editMark(id, {
                   mark: mark,
                   date: date,
                   lessonId: lessonId,
                   studentId: studentId,
               });
               alert(response?.message);
               setLoadingStudent(false);
               setUpdate(true);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Оценка"
				items={marks?.map(w => convertToItemWithFunction(w, ww => ww.mark + ", " + ww.lesson + ", " + ww.student))}
				id={id}
				setId={newIds => {
					setId(newIds);
                    marks?.forEach(g => {
                        setMark(g.mark);
                        setDate(g.date);
                        console.log(g.date);
                        setLessonId(g.lessonId);
                        setStudentId(g.studentId);
                    });
				}}
				callback={() => setFirstVisible(true)}
				/>
             {
                id && <div>
                    <CheckedInput className="EditInput" name="Оценка" min={2} max={5} value={mark} onChange={newScholarship => { setMark(newScholarship);
                    }}/>
                    <DateForm dateStruct={date || undefined} className='EditDate' name="Дата начала занятий" onChange={date => setDate(date)}/>
                    <IdRadio
                        className="EditRadio"
                        name="Предмет"
                        items={lessons?.map(convertToItem)}
                        id={lessonId}
                        setId={newIds => {
                            setLessonId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <IdRadio
                        className="EditRadio"
                        name="Студент"
                        items={students?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
                        id={studentId}
                        setId={newIds => {
                            setStudentId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <li className='AddButtonLi'>
                        {
                            loadingStudent ? <div className='AddButton loading'>
                                <img src="/icons/loading.png"/>
                            </div> 
                            : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Изменить" : ""}</button>
                        }
                        
                    </li>
                </div>
             }
        </ol>
    </form>;
}

function AddLesson() {
    const [name, setName] = useState("");
	const [teacherId, setTeacherId] = useState<number | null>(null);
	const [teachers, setTeachers] = useState<Teacher[] | null>(null);
	const [groupId, setGroupId] = useState<number | null>(null);
	const [groups, setGroups] = useState<Group[] | null>(null);
    const [term, setTerm] = useState<number | null>(null);
    const [course, setCourse] = useState<number | null>(null);
    const [type, setType] = useState<LessonType>("LAB");
    const [hours, setHours] = useState<number | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setTeachers(await getAllTeachers(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroups(await getGroups([], controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (name === "") {
               alert("Имя должно быть заполнено");
               setLoadingStudent(false);
               return;
           }
           if (!teacherId) {
            alert("Предмет не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!groupId) {
            alert("Студент не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!term) {
            alert("Семестр не заполнен");
            setLoadingStudent(false);
            return;
           }
           if (!course) {
            alert("Курс не заполнен");
            setLoadingStudent(false);
            return;
           }
           if (!hours) {
            alert("Часы не заполнены");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await addLesson({
                    name: name,
                    teacherId: teacherId,
                    groupId: groupId,
                    term: term,
                    course: course,
                    type: type,
                    hours: hours
               });
               alert(response?.message);
               setLoadingStudent(false);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
            <li className='TextInput'>
                <label htmlFor='name'><strong>Имя:</strong></label>
                <input value={name} onChange={e => setName(e.target.value)}/>
            </li>
            <CheckedInput className="EditInput" name="Семестр" min={1} max={8} value={term} onChange={newScholarship => { setTerm(newScholarship);
            }}/>
            <CheckedInput className="EditInput" name="Курс" min={1} max={4} value={course} onChange={newScholarship => { setCourse(newScholarship);
            }}/>
            <CheckedInput className="EditInput" name="Часы" min={1} value={hours} onChange={newScholarship => { setHours(newScholarship);
            }}/>
			<Select className='EditSelect' name="Тип"
					options={[{name: "Лабораторная", value: "LAB"},
							  {name: "Лекция", value: "LECTURE"},
							  {name: "Практика", value: "PRACTICE"}
                            ]} 
					value={type}
					onChange={value => {
						setType(value as LessonType);
					}}/>
			<IdRadio
                className="EditRadio"
				name="Преподаватель"
				items={teachers?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
				id={teacherId}
				setId={newIds => {
					setTeacherId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
			<IdRadio
                className="EditRadio"
				name="Группа"
				items={groups?.map(convertToItem)}
				id={groupId}
				setId={newIds => {
					setGroupId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                {
                    loadingStudent ? <div className='AddButton loading'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function DeleteLesson() {
    const [lessons, setLessons] = useState<Lesson[] | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [update, setUpdate] = useState(true);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setLessons(await getLessons({groupId: null, course: null}, controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Предмет"
				items={lessons?.map(convertToItem)}
				id={id}
				setId={newIds => {
					setId(newIds);
				}}
				callback={() => setFirstVisible(true)}
				/>
            <li className='AddButtonLi'>
                <button type="button" className={'AddButton'} onClick={e => {
                    (async () => {
                        if (id) {
                            const response = await deleteLesson(id);
                            alert(response?.message);
                            setUpdate(true); 
                        }
                    })();
                }}>Удалить</button>
            </li>
        </ol>
    </form>;
}

function EditLesson() {
    const [id, setId] = useState<number | null>(null);
    const [mark, setMark] = useState<number | null>(null);
	const [lessonId, setLessonId] = useState<number | null>(null);
	const [lessons, setLessons] = useState<Lesson[] | null>(null);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [students, setStudents] = useState<Student[] | null>(null);
    const [date, setDate] = useState<DateStruct | null>(null);
	const [firstVisible, setFirstVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [marks, setMarks] = useState<MarkString[] | null>(null);
    
    const [loadingStudent, setLoadingStudent] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible && update) {
			(async () => {
				setMarks(await allMarks(controller.signal));
				controller = null;
                setUpdate(false);
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible, update]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setLessons(await getLessons({groupId: null, course: null}, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setStudents(await getAllStudents(controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [firstVisible]);

    useEffect(() => {
       if (loadingStudent) {
           if (!mark) {
               alert("Оценка должна быть заполнена");
               setLoadingStudent(false);
               return;
           }
           if (!lessonId) {
            alert("Преподаватель не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!studentId) {
            alert("Студент не выбран");
            setLoadingStudent(false);
            return;
           }
           if (!date) {
            alert("Дата не заполнена");
            setLoadingStudent(false);
            return;
           }
           if (!id) {
            alert("Id must be not null");
            setLoadingStudent(false);
            return;
           }

           (async () => {
               const response = await editMark(id, {
                   mark: mark,
                   date: date,
                   lessonId: lessonId,
                   studentId: studentId,
               });
               alert(response?.message);
               setLoadingStudent(false);
               setUpdate(true);
           })(); 
       } 
    }, [loadingStudent]);

    return <form className='Form EditForm'>
        <ol className='FormContent'>
			<IdRadio
                className="EditRadio"
				name="Оценка"
				items={marks?.map(w => convertToItemWithFunction(w, ww => ww.mark + ", " + ww.lesson + ", " + ww.student))}
				id={id}
				setId={newIds => {
					setId(newIds);
                    marks?.forEach(g => {
                        setMark(g.mark);
                        setDate(g.date);
                        console.log(g.date);
                        setLessonId(g.lessonId);
                        setStudentId(g.studentId);
                    });
				}}
				callback={() => setFirstVisible(true)}
				/>
             {
                id && <div>
                    <CheckedInput className="EditInput" name="Оценка" min={2} max={5} value={mark} onChange={newScholarship => { setMark(newScholarship);
                    }}/>
                    <DateForm dateStruct={date || undefined} className='EditDate' name="Дата начала занятий" onChange={date => setDate(date)}/>
                    <IdRadio
                        className="EditRadio"
                        name="Предмет"
                        items={lessons?.map(convertToItem)}
                        id={lessonId}
                        setId={newIds => {
                            setLessonId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <IdRadio
                        className="EditRadio"
                        name="Студент"
                        items={students?.map(s => convertToItemWithFunction(s, (ss) => `${ss.firstname} ${ss.lastname} ${ss.patronymic}`))}
                        id={studentId}
                        setId={newIds => {
                            setStudentId(newIds);
                        }}
                        callback={() => setFirstVisible(true)}
                        />
                    <li className='AddButtonLi'>
                        {
                            loadingStudent ? <div className='AddButton loading'>
                                <img src="/icons/loading.png"/>
                            </div> 
                            : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Изменить" : ""}</button>
                        }
                        
                    </li>
                </div>
             }
        </ol>
    </form>;
}


function EditHeader(props: {children?: ReactElement | ReactElement[], name: string}) {
    const [visible, setVisible] = useState(false);
    
    return <div>
        <li className={'header' + (visible ? " visible" : "") + (props.children ? "" : " not_expandable")} onClick={e => setVisible(!visible)}>
			<p>{props.name}</p>
        </li>
        {props.children && <div hidden={!visible}>
            {props.children}
        </div>}
    </div>;
}

function EditPage() {
    return <>
        <Header/>
        <ol className='List small'>
            <EditHeader name='Добавить студента'>
                <AddStudent/>
            </EditHeader>
            <EditHeader name='Добавить преподавателя'>
                <AddTeacher/>
            </EditHeader>
            <EditHeader name='Добавить группу'>
                <AddGroup/>
            </EditHeader>
            <EditHeader name='Удалить группу'>
                <DeleteGroup/>
            </EditHeader>
            <EditHeader name='Изменить группу'>
                <EditGroup/>
            </EditHeader>
            <EditHeader name='Добавить факультет'>
                <AddFaculty/>
            </EditHeader>
            <EditHeader name='Удалить факультет'>
                <DeleteFaculty/>
            </EditHeader>
            <EditHeader name='Изменить факультет'>
                <EditFaculty/>
            </EditHeader>
            <EditHeader name='Добавить кафедру'>
                <AddDepartment/>
            </EditHeader>
            <EditHeader name='Удалить кафедру'>
                <DeleteDepartment/>
            </EditHeader>
            <EditHeader name='Изменить кафедру'>
                <EditDepartment/>
            </EditHeader>
            <EditHeader name='Добавить работу'>
                <AddWork/>
            </EditHeader>
            <EditHeader name='Удалить работу'>
                <DeleteWork/>
            </EditHeader>
            <EditHeader name='Изменить работу'>
                <EditWork/>
            </EditHeader>
            <EditHeader name='Добавить оценку'>
                <AddMark/>
            </EditHeader>
            <EditHeader name='Удалить оценку'>
                <DeleteMark/>
            </EditHeader>
            <EditHeader name='Изменить оценку'>
                <EditMark/>
            </EditHeader>
            <EditHeader name='Добавить предмет'>
                <AddLesson/>
            </EditHeader>
            <EditHeader name='Удалить предмет'>
                <DeleteLesson/>
            </EditHeader>
            <EditHeader name='Изменить предмет'>
                <EditLesson/>
            </EditHeader>
        </ol>
    </>
}

export default EditPage;