import { useState } from "react";

export interface Option {
    name: string;
    value: string;
}

export function Select(props: {name: string, options: Option[], value: string, onChange: (value: string) => void}) {
    const [visible, setVisible] = useState(false);
    
    return <li className='Select'>
        <label onClick={e => setVisible(!visible)} htmlFor={props.name}>{props.name}</label>
        <div>
            <select hidden={!visible} id={props.name} value={props.value} onChange={e => {
            props.onChange(e.target.value);
            }}>
                {
                    props.options.map(o => {
                        return <option value={o.value}>{o.name}</option>
                    })
                }
            </select>
        </div>
    </li>;
}