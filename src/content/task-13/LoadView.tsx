import { LessonType, Load } from "../../api/nsu_base";

function printType(type: LessonType) {
    return type === "LAB" ? 'лаб' : type === "PRACTICE" ? "практика" : "лекция";
}

function LoadView(props: {load: Load}) {
    return <div>
        <h2>Нагрузка:</h2>
        <h3>По дисциплинам:</h3>
        <ol>
            {
                props.load.lessons.map(l => {
                    return <li key={l.id}>
                        <p>{l.name}</p>
                        <p>{printType(l.type)}</p>
                        <p>{`${l.hours} часов`}</p>
                    </li>;
                })
            }
        </ol>
        <h3>По видам занятий:</h3>
        <ol>
            {
                props.load.types.map(t => {
                    return <li key={t.type}>
                        <p>{printType(t.type)}</p>
                        <p>{`${t.hours} часов`}</p>
                    </li>;
                })
            }
        </ol>
        <h3>Общая</h3>
        <p>{`${props.load.lessons.map(l => l.hours).reduce((sum, h) => sum + h, 0)} часов`}</p>
    </div>;
}

export default LoadView;