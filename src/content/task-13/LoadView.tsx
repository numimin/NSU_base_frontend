import { useState } from "react";
import { LessonType, Load } from "../../api/nsu_base";

function printType(type: LessonType) {
    return type === "LAB" ? 'лаб' : type === "PRACTICE" ? "практика" : "лекция";
}

function LoadView(props: {load: Load}) {
    const [disciplineVisible, setDisciplineVisible] = useState(false);
    const [lectureVisible, setLectureVisible] = useState(false);
    const [commonVisible, setCommonVisible] = useState(false);

    return <div className="List">
        <h2>Нагрузка</h2>
        <p onClick={e => setDisciplineVisible(!disciplineVisible)} className={"header " + (disciplineVisible ? "visible" : "")}>По дисциплинам:</p>
        <ol hidden={!disciplineVisible} className="content">
            {
                props.load.lessons.map(l => {
                    return <li key={l.id}>
                        <p><strong>{`${l.name}, `}</strong>{`${printType(l.type)}, ${l.hours} часов`}</p>
                    </li>;
                })
            }
        </ol>
        <p onClick={e => setLectureVisible(!lectureVisible)} className={"header " + (lectureVisible ? "visible" : "")}>По видам занятий:</p>
        <ol hidden={!lectureVisible} className="content">
            {
                props.load.types.map(t => {
                    return <li key={t.type}>
                        <p><strong>{`${printType(t.type)}`}</strong>{`, ${t.hours} часов`}</p>
                    </li>;
                })
            }
        </ol>
        <p  onClick={e => setCommonVisible(!commonVisible)} className={"header " + (commonVisible ? "visible" : "")}>Общая</p>
        <p hidden={!commonVisible} className="content">{`${props.load.lessons.map(l => l.hours).reduce((sum, h) => sum + h, 0)} часов`}</p>
    </div>;
}

export default LoadView;