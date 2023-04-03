const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function DateForm(props: {name: string, date: Date, onChange: (date: Date) => void}) {
    return <div className="dateForm">
        <label>{props.name}</label>
        <input type="number" size={3} min={0} max={daysInMonth[props.date.getMonth()]} id="day" name="day" onChange={
            e => {
                const newDate = new Date(props.date.getTime());
                newDate.setDate(parseInt(e.target.value));
                props.onChange(newDate);
            }
        }/>
        <p>/</p>
        <input type="number" size={3} min={1} max={12} id="month" name="month" onChange={
            e => {
                const newDate = new Date(props.date.getTime());
                newDate.setMonth(parseInt(e.target.value) - 1);
                props.onChange(newDate);
            }
        }/>
        <p>/</p>
        <input type="year" size={2} min={0} id="year" name="year" onChange={
            e => {
                const newDate = new Date(props.date.getTime());
                newDate.setFullYear(parseInt(e.target.value));
                props.onChange(newDate);
            }
        }/>
    </div>;
}

export default DateForm;