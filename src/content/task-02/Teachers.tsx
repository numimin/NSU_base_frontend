import {useState, useEffect} from 'react';
import {Teacher, Faculty, Department, getDepartment, getFaculty, deleteTeacher, SBoolean, Category, Gender, updateTeacher, getDepartments, DateStruct} from '../../api/nsu_base';
import { IdRadio, convertToItem } from '../forms/IdCheckbox';
import CheckedInput from '../forms/CheckedInput';
import { Select } from '../forms/Select';
import DateForm from '../forms/DateForm';

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

function AddTeacher(props: {
	id: number,
	name: string,
	surname: string,
	patronymic: string,
	category: Category,
	gender: Gender,
	hasChildren: SBoolean,
	salary: number,
	graduateStudent: SBoolean,
	phdThesisDate: DateStruct | null,
	departmentId: number,
	phdDissertation: string | null,
	doctoralDissertation: string | null,
	update: () => void
}) {
    const [name, setName] = useState(props.name);
    const [surname, setSurname] = useState(props.surname);
    const [patronymic, setPatronymic] = useState(props.patronymic);
    const [category, setCategory] = useState(props.category);
    const [gender, setGender] = useState(props.gender);
    const [hasChildren, setHasChildren] = useState(props.hasChildren);
    const [salary, setSalary] = useState<number | null>(props.salary);
    const [graduateStudent, setGraduateStudent] = useState(props.graduateStudent);
    const [phdThesisDate, setPhdThesisDate] = useState<DateStruct | null>(props.phdThesisDate);
	const [departmentId, setDepartmentId] = useState<number | null>(props.departmentId);
	const [departments, setDepartments] = useState<Department[] | null>(null);
    const [phdDissertation, setPhdDissertation] = useState<string | null>(props.phdDissertation);
    const [doctoralDissertation, setDoctoralDissertation] = useState<string | null>(props.doctoralDissertation);
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
               const response = await updateTeacher(props.id, {
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
            <DateForm dateStruct={phdThesisDate || undefined} className='EditDate' name="Дата защиты" onChange={date => setPhdThesisDate(date)}/>
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

function TeacherView(props: {update: () => void, teacher: Teacher}) {
	const [faculty, setFaculty] = useState<Faculty | null>(null);
	const [department, setDepartment] = useState<Department | null>(null);
	const [visible, setVisible] = useState(false);
	const [firstVisible, setfirstVisible] = useState(false);
	const [updateVisible, setUpdateVisible] = useState(false);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				if (!department) return;
				setFaculty(await getFaculty(department.facultyId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [department, firstVisible])

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		if (firstVisible) {
			(async () => {
				setDepartment(await getDepartment(props.teacher.departmentId, controller.signal));
				controller = null;
			}) ();
		}
		return () => controller?.abort();
	}, [props.teacher.departmentId, firstVisible]);

	const teacher = props.teacher;
	return <li>
		<div onClick={e => {{
			setVisible(!visible);
			if (!visible) {
				setUpdateVisible(false);
			}
			setfirstVisible(true);
		}}}className={"header" + ((visible || updateVisible) ? " visible" : "")}>
			<p>{`${teacher.firstname} ${teacher.lastname} ${teacher.patronymic}`}</p>
			<img src="/icons/edit.png" onClick={e => {
				if (!updateVisible) {
					setVisible(false);
				}
				setUpdateVisible(!updateVisible);
				setfirstVisible(true);
				e.stopPropagation();
			}}/>
			<img src="/icons/delete.png" onClick={e => {
				(async () => {
					const response = await deleteTeacher(teacher.id);
					if (!response?.result) {
						alert(response?.message);
					}
					props.update();
				})();
				e.stopPropagation();
			}}/>
		</div>
		<div hidden={!updateVisible}>
			<AddTeacher id={teacher.id}
				name={teacher.firstname}
				surname={teacher.lastname}
				patronymic={teacher.patronymic}
				category={teacher.category}
				gender={teacher.gender}
				hasChildren={teacher.hasChildren ? "TRUE" : "FALSE"}
				salary={teacher.salary}
				graduateStudent={teacher.graduateStudent ? "TRUE" : "FALSE"}
				phdThesisDate={fromString(teacher.phdThesisDate)}
				departmentId={teacher.departmentId}
				phdDissertation={teacher.phdDissertation}
				doctoralDissertation={teacher.doctoralDissertation}
				update={() => {
					setUpdateVisible(false);
					props.update();
				}}
			/>
		</div>
		<div hidden={!visible} className={'content '  + (visible ? "" : "hidden")}>
			{
				faculty && <p><strong>{faculty.name}</strong></p>
			}
			{
				department && <p><strong>{`Кафедра`}</strong><span>{` ${department.name}`}</span></p>
			}
			<p><strong>{`Категория:`}</strong><span>{` ${teacher.category === "ASSISTANT" ? "Ассистент" : teacher.category === "PROFESSOR" ? "Профессор" : "Доцент"}`}</span></p>
			<p><strong>{`Пол:`}</strong><span>{` ${teacher.gender === "MALE" ? "Мужской" : "Женский"}`}</span></p>
			<p><strong>{teacher.hasChildren ? "Дети " : "Детей "}</strong><span>{`${teacher.hasChildren ? "есть" : "нет"}`}</span></p>
			<p><strong>{`${teacher.graduateStudent ? "Обучается в аспирантуре" : ""}`}</strong></p>
			<p><strong>{teacher.phdThesisDate ? "Дата защиты: " : "Не защищался"}</strong><span>{teacher.phdThesisDate ? `${teacher.phdThesisDate}` : ""}<span/></span></p>
			<p><strong>{`Зарплата:`}</strong><span>{` ${teacher.salary} рублей`}<span/></span></p>
		</div>
	</li>;
}

function Teachers(props: {update: () => void, teachers: Teacher[]}) {
	return <div>
		<h2 className='ListHeader'>Преподаватели</h2>
		<ol className='List'>
			{
				props.teachers.sort((lhs, rhs) => {
					const lhsName = lhs.firstname + lhs.lastname + lhs.patronymic;
					const rhsName = rhs.firstname + rhs.lastname + rhs.patronymic;
					if (lhsName <= rhsName) {
						return 1;
					}
					if (lhsName >= rhsName) {
						return -1;
					}
					return 0;
				}).map(teacher => <TeacherView update={props.update} key={teacher.id} teacher={teacher}/>)
			}
		</ol>
	</div>;
}

export default Teachers;