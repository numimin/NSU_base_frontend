import { useState } from 'react';
import './CheckedInput.scss';

function CheckedInput(props: {name: string, value: number | null, onChange: (value: number | null) => void}) {
	const [clicked, setClicked] = useState(false);

	return <div className="CheckedInput">
		<label className={clicked ? "clicked" : ""} onClick={e => setClicked(!clicked)} htmlFor={props.name}>{props.name}</label>
		<div>
			<button type='button' hidden={!clicked} onClick={_ => props.onChange(null)}>x</button>
			<input hidden={!clicked} type="number" id={props.name} value={props.value ? props.value : ""} onChange={e => {
				props.onChange(parseInt(e.target.value));
			}}/>
		</div>
	</div>;
}

export default CheckedInput;