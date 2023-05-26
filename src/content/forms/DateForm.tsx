import './DateForm.scss';

import {useState} from 'react';
import {DateStruct} from '../../api/nsu_base';

const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function DateForm(props: {dateStruct?: DateStruct, className?: string, name: string, onChange: (date: DateStruct) => void}) {
    const [visible, setVisible] = useState(false);
    const [focus, setFocus] = useState(false);
    const [date, setDate] = useState<DateStruct>({
        day: props.dateStruct?.day || NaN,
        month: props.dateStruct?.month || NaN,
        year: props.dateStruct?.year || NaN,
    });

    return <div className={"DateForm " + (props.className || "")}>
        <label className={visible ? "clicked" : ""} onClick={e => {setVisible(!visible)}}>{props.name}</label>
        <div className={(visible ? "" : "hidden ")  + (focus ? "focus" : "")}>
            <input onFocus={e => setFocus(true)}
                   onBlur={e => setFocus(false)}
                type="number" size={3} min={1} max={daysInMonth[date.month]} id={`day_${props.name}`} name={`day_${props.name}`} value={date.day || ""} onChange={
                e => {
                    const newDate = structuredClone(date);
                    newDate.day = parseInt(e.target.value);
                    setDate(newDate);
                    props.onChange(newDate);
                }
            }/>
            <p>/</p>
            <input onFocus={e => setFocus(true)}
                   onBlur={e => setFocus(false)}
                type="number" size={3} min={1} max={12} id={`month_${props.name}`} name={`month_${props.name}`} value={date.month || ""} onChange={
                e => {
                    const newDate = structuredClone(date);
                    newDate.month = parseInt(e.target.value);
                    setDate(newDate);
                    props.onChange(newDate);
                }
            }/>
            <p>/</p>
            <input onFocus={e => setFocus(true)}
                   onBlur={e => setFocus(false)}
                type="year" size={2} min={0} id={`year_${props.name}`} name={`year_${props.name}`} value={date.year || ""} onChange={
                e => {
                    const newDate = structuredClone(date);
                    newDate.year = parseInt(e.target.value);
                    setDate(newDate);
                    props.onChange(newDate);
                }
            }/>
        </div>
    </div>;
}

export default DateForm;