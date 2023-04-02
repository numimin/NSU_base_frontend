function CheckedInput(props: {name: string, value: number | null, onChange: (value: number | null) => void}) {
	return <>
		<input type="checkbox" checked={props.value !== null} onChange={e => {
			if (e.target.checked != true) {
				props.onChange(null);
			} else {
				props.onChange(0);
			}
		}}/>
		<label htmlFor={props.name}>{props.name}</label>
		<input type="number" id={props.name} value={props.value ? props.value : undefined} onChange={e => {
			if (props.value === null) return;
			props.onChange(parseInt(e.target.value));
		}}/>
	</>;
}

export default CheckedInput;