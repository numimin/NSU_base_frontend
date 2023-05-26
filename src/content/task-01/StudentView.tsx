import { useEffect, useState } from "react";
import { DateStruct, Faculty, Gender, Group, SBoolean, Student, addStudent, deleteStudent, getFaculty, getGroup, getGroups, updateStudent } from "../../api/nsu_base";
import DateForm from "../forms/DateForm";
import { Select } from "../forms/Select";
import CheckedInput from "../forms/CheckedInput";
import { IdRadio, convertToItem } from "../forms/IdCheckbox";

function fromString(date: string): DateStruct {
	const year = parseInt(date.slice(0, 4));
	const month = parseInt(date.slice(5, 7));
	const day = parseInt(date.slice(8, 10));
	return {
		year: year,
		month: month,
		day: day
	}
}

function AddStudent(props: {
	id: number, 
	name: string,
	surname: string,
	patronymic: string,
	dateOfBirth: DateStruct,
	gender: Gender,
	hasChildren: SBoolean,
	scholarship: number,
	groupIds: number | null,
	update: () => void,
}) {
    const [name, setName] = useState(props.name);
    const [surname, setSurname] = useState(props.surname);
    const [patronymic, setPatronymic] = useState(props.patronymic);
    const [dateOfBirth, setDateOfBirth] = useState<DateStruct | null>(props.dateOfBirth);
    const [gender, setGender] = useState(props.gender);
    const [hasChildren, setHasChildren] = useState(props.hasChildren);
    const [scholarship, setScholarship] = useState<number | null>(props.scholarship);
	const [groupIds, setGroupIds] = useState<number | null>(props.groupIds);
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
               const response = await updateStudent(props.id, {
                   firstname: name,
                   lastname: surname,
                   patronymic: patronymic,
                   gender: gender as Gender,
                   groupId: groupIds,
                   scholarship: scholarship,
                   hasChildren: hasChildren === "TRUE",
                   dateOfBirth: dateOfBirth
               });
			   if (!response?.result) {
					alert(response?.message);
			   }
			   props.update();
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
            <DateForm dateStruct={dateOfBirth || undefined} className='EditDate' name="Дата рождения" onChange={date => setDateOfBirth(date)}/>
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
            <li className='AddButtonLi smol'>
                {
                    loadingStudent ? <div className='AddButton loading smol'>
                        <img src="/icons/loading.png"/>
                    </div> 
                    : <button type="button" className={'AddButton' + (loadingStudent ? " loading" : "")} onClick={e => setLoadingStudent(true)}>{!loadingStudent ?  "Добавить" : ""}</button>
                }
                
            </li>
        </ol>
    </form>;
}

function StudentView(props: {update: () => void, student: Student, theme?: string}) {
	const [group, setGroup] = useState<Group | null>(null);
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [visible, setVisible] = useState(false);
	const [firstVisible, setFirstVisible] = useState(false);
	const [updateVisible, setUpdateVisible] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				if (!group) return;
				setFaculty(await getFaculty(group.facultyId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [group, firstVisible])

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setGroup(await getGroup(student.groupId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [props.student, firstVisible]);

	const student = props.student;
	return <>
		<div onClick={e => {{
			setVisible(!visible);
			if (!visible) {
				setUpdateVisible(false);
			}
			setFirstVisible(true);
		}}}className={"header" + ((visible || updateVisible) ? " visible" : "")}>
			<p>{`${student.firstname} ${student.lastname} ${student.patronymic}`}</p>
			<img src="/icons/edit.png" onClick={e => {
				if (!updateVisible) {
					setVisible(false);
				}
				setUpdateVisible(!updateVisible);
				setFirstVisible(true);
				e.stopPropagation();
			}}/>
			<img src="/icons/delete.png" onClick={e => {
				(async () => {
					const response = await deleteStudent(student.id);
					if (!response?.result) {
						alert(response?.message);
					}
					props.update();
				})();
			}}/>
		</div>
		<div hidden={!updateVisible}>
			<AddStudent
				id={props.student.id}
				name={props.student.firstname}
				surname={props.student.lastname}
				patronymic={props.student.patronymic}
				dateOfBirth={fromString(props.student.dateOfBirth)}
				gender={props.student.gender}
				hasChildren={props.student.hasChildren ? "TRUE" : "FALSE"}
				scholarship={props.student.scholarship}
				groupIds={props.student.groupId}
				update={() => {
					setUpdateVisible(false);
					props.update();
				}}
			/>
		</div>
		<div hidden={!visible} className={"content " + (visible ? "" : "hidden")}>
			{
				faculty && <p><strong>{faculty.name}</strong></p>
			}
			{
				group && <p><strong>{`Группа `}</strong><span>{`${group.name}`}</span></p>
			}
			<p><strong>{`Пол: `}</strong><span>{`${student.gender === "MALE" ? "Мужской" : "Женский"}`}</span></p>
			<p><strong>{`Дата рождения:`}</strong><span>{` ${student.dateOfBirth}`}</span></p>
			<p><strong>{student.hasChildren ? "Дети " : "Детей "}</strong><span>{`${student.hasChildren ? "есть" : "нет"}`}</span></p>
			<p><strong>{`Стипендия:`}</strong><span>{` ${student.scholarship} рублей`}</span></p>
			{
				props.theme && 
				<p><strong>{`Тема дипломной работы:`}</strong><span>{` ${props.theme}`}</span></p>
			}
		</div>
	</>;
}

export default StudentView;