import {useState, useEffect, ReactElement} from 'react';
import Header from '../Header';
import './EditPage.scss';
import DateForm from '../forms/DateForm';
import { Category, DateStruct, Department, Faculty, Gender, Group, SBoolean, addFaculty, addGroup, addStudent, addTeacher, deleteFaculty, deleteGroup, editFaculty, editGroup, getDepartments, getFaculties, getGroups } from '../../api/nsu_base';
import { Select } from '../forms/Select';
import CheckedInput from '../forms/CheckedInput';
import { IdRadio, convertToItem } from '../forms/IdCheckbox';

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
        </ol>
    </>
}

export default EditPage;