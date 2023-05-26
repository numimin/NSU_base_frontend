import {useState, useEffect, ReactElement} from 'react';
import Header from '../Header';
import './EditPage.scss';
import DateForm from '../forms/DateForm';
import { DateStruct, Gender, Group, SBoolean, addStudent, getGroups } from '../../api/nsu_base';
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
        </ol>
    </>
}

export default EditPage;