import { useState } from 'react';
import './CheckedInput.scss';

function CheckedInput(props: {className?: string, min?: number, max?: number, name: string, value: number | null, onChange: (value: number | null) => void}) {
	const [clicked, setClicked] = useState(false);

	return <div className={"CheckedInput " + (props.className || "")}>
		<label className={clicked ? "clicked" : ""} onClick={e => setClicked(!clicked)} htmlFor={props.name}>{props.name}</label>
		<div>
			<button type='button' hidden={!clicked} onClick={_ => props.onChange(null)}>x</button>
			<input 
				hidden={!clicked} 
				type="number" 
				id={props.name} 
				value={props.value ? props.value : ""} 
				onChange={e => {
					const value = e.target.value;
					if (!value || value === "") {
						props.onChange(null);
					} else {
						const parsed = parseInt(e.target.value);
						if (props.min && props.min > parsed) {
							props.onChange(null);
							return;
						}
						if (props.max && props.max < parsed) {
							props.onChange(null);
							return;
						}
						props.onChange(parsed);
					}
				}}
				min={props.min}
				max={props.max}
				/>
		</div>
	</div>;
}

export default CheckedInput;