import {useState} from 'react';
import {StudentQuery, Gender} from '../../api/nsu_base';

function StudentsForm(props: {query: StudentQuery, onChange: (query: StudentQuery) => void}) {
	const [gender, setGender] = useState<Gender>(props.query.gender);

	const onChange = (_gender?: Gender) => {
		props.onChange({
			gender: _gender || gender
		});
	}

	return <form>
		<ol>
			<li>
				<label htmlFor="gender">Gender</label>
				<select id="gender" value={gender} onChange={e => {
					setGender(e.target.value as Gender);
					onChange(e.target.value as Gender);
				}}>
					<option value="NONE">None</option>
					<option value="MALE">Male</option>
					<option value="FEMALE">Female</option>
				</select>
			</li>
		</ol>
	</form>;
}

export {
	StudentsForm,
}