import { useState } from 'react';
import './CheckedInput.scss';

function CheckedInput(props: {name: string, value: number | null, onChange: (value: number | null) => void}) {
	const [clicked, setClicked] = useState(false);

	return <div className="CheckedInput">
		<div>
			<input type="checkbox" checked={props.value !== null} onChange={e => {
				if (e.target.checked != true) {
					props.onChange(null);
				} else {
					props.onChange(0);
				}
			}}/>
			<label onClick={e => setClicked(!clicked)} htmlFor={props.name}>{props.name}</label>
		</div>
		<input hidden={!clicked} type="number" id={props.name} value={props.value ? props.value : undefined} onChange={e => {
			if (props.value === null) return;
			props.onChange(parseInt(e.target.value));
		}}/>
	</div>;
}

export default CheckedInput;