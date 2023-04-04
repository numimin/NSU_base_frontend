import {useState, useEffect} from 'react';
import {DateStruct} from '../../api/nsu_base';

const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function DateForm(props: {name: string, onChange: (date: DateStruct) => void}) {
    const [date, setDate] = useState<DateStruct>({
        day: NaN,
        month: NaN,
        year: NaN
    });

    return <div className="dateForm">
        <label>{props.name}</label>
        <input type="day" size={3} min={1} max={daysInMonth[date.month]} id={`day_${props.name}`} name={`day_${props.name}`} value={date.day || ""} onChange={
            e => {
                const newDate = structuredClone(date);
                newDate.day = parseInt(e.target.value);
                setDate(newDate);
                props.onChange(newDate);
            }
        }/>
        <p>/</p>
        <input type="month" size={3} min={1} max={12} id={`month_${props.name}`} name={`month_${props.name}`} value={date.month || ""} onChange={
            e => {
                const newDate = structuredClone(date);
                newDate.month = parseInt(e.target.value);
                setDate(newDate);
                props.onChange(newDate);
            }
        }/>
        <p>/</p>
        <input type="year" size={2} min={0} id={`year_${props.name}`} name={`year_${props.name}`} value={date.year || ""} onChange={
            e => {
                const newDate = structuredClone(date);
                newDate.year = parseInt(e.target.value);
                setDate(newDate);
                props.onChange(newDate);
            }
        }/>
    </div>;
}

export default DateForm;