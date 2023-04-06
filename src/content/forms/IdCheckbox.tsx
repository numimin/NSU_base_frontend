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

function IdRadio(props: {name: string, items: Item[] | null | undefined, id: number | null | undefined, setId: (id: number) => void}) {
    return <li>
        {
        props.items && <>
            <h2>{props.name}</h2>
            <ol>
                {
                props.items.map(item => {
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
                }
            </ol>
        </>    
        }
    </li>;
}

function IdCheckbox(props: {name: string, items: Item[] | null | undefined, ids: number[] | null | undefined, setIds: (ids: number[]) => void}) {
    return <li>
    {
        props.items && <>
            <h2>{props.name}</h2>
            <ol>
                {
                    props.items.map(item => {
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