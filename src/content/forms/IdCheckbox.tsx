import "./IdCheckbox.scss";
import { useState } from "react";

interface Item {
    name: string;
    id: number
}

function convertToItem(a: any): Item {
    return {
        name: a.name,
        id: a.id,
    }
}

export function convertToItemWithFunction(a: any, name?: (t: any) => string): Item {
    return {
        name: name ? name(a) : a.name,
        id: a.id,
    }
}

function IdRadio(props: {className?: string, callback?: () => void, name: string, items: Item[] | null | undefined, id: number | null | undefined, setId: (id: number) => void}) {
    const [visible, setVisible] = useState(false);
    const [firstVisible, setFirstVisible] = useState(false);
    
    return <li className={"IdCheckbox " + (props.className || "")}>
        {
        <>
            <p className={visible ? "clicked" : ""} onClick={
                e => {
                    setVisible(!visible);
                    if (!firstVisible) {
                        props.callback?.call(props.callback);
                    }
                    setFirstVisible(true);
                }
            }>{props.name}</p>
            <ol hidden={!visible}>
                {
                props.items ? props.items.sort((lhs, rhs) => {
					if (lhs.name <= rhs.name) {
						return -1;
					}
					if (lhs.name >= rhs.name) {
						return 1;
					}
					return 0;
				}).map(item => {
                    return <li key={item.id}>
                            <input type="radio" 
                            id={`${props.name}${item.id}`} 
                            checked={props.id === item.id}
                            onChange={e => {
                                if (e.target.checked) {
                                    props.setId(item.id);
                                }
                            }}/>
                            <label htmlFor={`${props.name}${item.id}`}>{item.name}</label>
                        </li>
                    })
                    : <p className="usual">Идет загрузка...</p>
                }
            </ol>
        </>    
        }
    </li>;
}

function IdCheckbox(props: {className?: string, callback?: () => void, name: string, items: Item[] | null | undefined, ids: number[] | null | undefined, setIds: (ids: number[]) => void}) {
    const [visible, setVisible] = useState(false);
    const [firstVisible, setFirstVisible] = useState(false);
    
    return <li className="IdCheckbox">
    {
        <>
            <p className={visible ? "clicked" : ""} onClick={
                e => {
                    setVisible(!visible);
                    if (!firstVisible) {
                        props.callback?.call(props.callback);
                    }
                    setFirstVisible(true);
                }
            }>{props.name}</p>
            <ol hidden={!visible}>
                {
                    props.items ? props.items.sort((lhs, rhs) => {
					if (lhs.name <= rhs.name) {
						return -1;
					}
					if (lhs.name >= rhs.name) {
						return 1;
					}
					return 0;
				}).map(item => {
                        return <li key={item.id}>
                            <input type="checkbox" 
                                   id={`item${item.id}`} 
                                   checked={props.ids?.includes(item.id)}
                                   onChange={e => {
                                        if (e.target.checked) {
                                            let newIds = [item.id];
                                            if (props.ids) {
                                                newIds = [...props.ids, item.id]
                                            }
                                            props.setIds(newIds);
                                        } else {
                                            let newIds = [item.id];
                                            if (props.ids) {
                                                newIds = [...props.ids]
                                            }
                                            const index = newIds.indexOf(item.id);
                                            if (index !== -1) {
                                                newIds.splice(index, 1);
                                                props.setIds(newIds);
                                            }
                                        }
                                   }}/>
                            <label htmlFor={`${props.name}${item.id}`}>{item.name}</label>
                        </li>
                    })
                    : <p className="usual">Идет загрузка...</p>
                }
            </ol>
        </>
    }
    </li>
}

export type {
    Item,
}

export {
    IdCheckbox,
    IdRadio,
    convertToItem,
}