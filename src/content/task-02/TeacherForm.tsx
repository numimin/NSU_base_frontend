import {useState, useEffect} from 'react';
import {TeachersQuery, Category, Gender, SBoolean, DateStruct} from '../../api/nsu_base';
import CheckedInput from '../forms/CheckedInput';
import DateForm from '../forms/DateForm';

function TeacherForm(props: {query: TeachersQuery, onChange: (query: TeachersQuery) => void}) {
	const [category, setCategory] = useState<Category>(props.query.category);
	const [gender, setGender] = useState<Gender>(props.query.gender);
	const [hasChildren, setHasChildren] = useState<SBoolean>(props.query.hasChildren);
	const [minSalary, setMinSalary] = useState<number | null>(props.query.minSalary);
	const [maxSalary, setMaxSalary] = useState<number | null>(props.query.maxSalary);
	const [graduateStudent, setGraduateStudent] = useState<SBoolean>(props.query.graduateStudent);
	const [phdThesisStartDate, setPhdThesisStartDate] = useState<DateStruct | null>(props.query.phdThesisStartDate);
	const [phdThesisEndDate, setPhdThesisEndDate] = useState<DateStruct | null>(props.query.phdThesisEndDate);

	const onChange = (params: {
		category?: Category,
		gender?: Gender,
		hasChildren?: SBoolean,
		minSalary?: number | null,
		maxSalary?: number | null,
		graduateStudent?: SBoolean,
		phdThesisStartDate?: DateStruct | null,
		phdThesisEndDate?: DateStruct | null,
	} = {}) => {
		props.onChange({
			category: params.category || category,
			gender: params.gender || gender,
			hasChildren: params.hasChildren || hasChildren,
			minSalary: params.minSalary === undefined ? minSalary : params.minSalary,
			maxSalary: params.maxSalary === undefined ? maxSalary : params.maxSalary,
			graduateStudent: params.graduateStudent || graduateStudent,
			phdThesisStartDate: params.phdThesisStartDate === undefined ? phdThesisStartDate : params.phdThesisStartDate,
			phdThesisEndDate: params.phdThesisEndDate === undefined ? phdThesisEndDate : params.phdThesisEndDate,
			facultyIds: [],
			departmentIds: []
		});
	}

	const createDate = (dateStruct: DateStruct | null) => {
		const date = new Date();
		if (dateStruct) {
			date.setDate(dateStruct.day);
			date.setMonth(dateStruct.month);
			date.setFullYear(dateStruct.year);
		}
		return date;
	}

	return <form>
		<ol>
			<li>
				<label htmlFor="category">Категория</label>
				<select id="category" value={category} onChange={e => {
					setCategory(e.target.value as Category);
					onChange({category: e.target.value as Category});
				}}>
					<option value="NONE">Не указана</option>
					<option value="ASSISTANT">Ассистент</option>
					<option value="ASSISTANT_PROFESSOR">Доцент</option>
					<option value="PROFESSOR">Профессор</option>
				</select>
			</li>
			<li>
				<label htmlFor="gender">Пол</label>
				<select id="gender" value={gender} onChange={e => {
					setGender(e.target.value as Gender);
					onChange({gender: e.target.value as Gender});
				}}>
					<option value="NONE">Не указан</option>
					<option value="MALE">Мужской</option>
					<option value="FEMALE">Женский</option>
				</select>
			</li>
			<li>
				<label htmlFor="children">Дети</label>
				<select id="children" value={hasChildren} onChange={e => {
					setHasChildren(e.target.value as SBoolean);
					onChange({hasChildren: e.target.value as SBoolean});
				}}>
					<option value="NONE">Не указано</option>
					<option value="TRUE">Есть</option>
					<option value="FALSE">Нет</option>
				</select>
			</li>
			<li>
				<CheckedInput name="Зарплата >= " value={minSalary} onChange={newMinSalary => {
					setMinSalary(newMinSalary);
					onChange({minSalary: newMinSalary});
				}}/>
			</li>
			<li>
				<CheckedInput name="Зарплата <= " value={maxSalary} onChange={newMaxSalary => {
					setMaxSalary(newMaxSalary);
					onChange({maxSalary: newMaxSalary});
				}}/>
			</li>
			<li>
				<label htmlFor="graduateStudent">Обучается в аспирантуре</label>
				<select id="graduateStudent" value={graduateStudent} onChange={e => {
					setGraduateStudent(e.target.value as SBoolean);
					onChange({graduateStudent: e.target.value as SBoolean});
				}}>
					<option value="NONE">Не указано</option>
					<option value="TRUE">Да</option>
					<option value="FALSE">Нет</option>
				</select>
			</li>
			<DateForm name={"Дата защиты >="} date={createDate(phdThesisStartDate)} onChange={date => {
				const newDateStruct = {
					day: date.getDate(),
					month: date.getMonth(),
					year: date.getFullYear()
				};
				setPhdThesisStartDate(newDateStruct); 
				onChange({phdThesisStartDate: newDateStruct});
			}}/>
			<DateForm name={"Дата защиты <="} date={createDate(phdThesisEndDate)} onChange={date => {
				const newDateStruct = {
					day: date.getDate(),
					month: date.getMonth(),
					year: date.getFullYear()
				};
				setPhdThesisEndDate(newDateStruct); 
				onChange({phdThesisEndDate: newDateStruct});
			}}/>
		</ol>
	</form>;
}

export default TeacherForm;