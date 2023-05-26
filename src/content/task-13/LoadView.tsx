import { useState } from "react";
import { LessonType, Load } from "../../api/nsu_base";

function printType(type: LessonType) {
    return type === "LAB" ? 'лаб' : type === "PRACTICE" ? "практика" : "лекция";
}

function LoadView(props: {load: Load}) {
    const [disciplineVisible, setDisciplineVisible] = useState(false);
    const [lectureVisible, setLectureVisible] = useState(false);
    const [commonVisible, setCommonVisible] = useState(false);

    return <div>
        <h2>Нагрузка</h2>
        <div className="List">
            <li>
                <div onClick={e => setDisciplineVisible(!disciplineVisible)} className={"header " + (disciplineVisible ? "visible" : "")}>
                    <p>По дисциплинам:</p>
                </div>
                <ol hidden={!disciplineVisible} className="content">
                    {
                        props.load.lessons.map(l => {
                            return <p key={l.id}>
                                <p><strong>{`${l.name}, `}</strong>{`${printType(l.type)}, ${l.hours} часов`}</p>
                            </p>;
                        })
                    }
                </ol>
            </li>
            <li>
                <div onClick={e => setLectureVisible(!lectureVisible)} className={"header " + (lectureVisible ? "visible" : "")}>
                    <p>По видам занятий:</p>
                </div>
                <ol hidden={!lectureVisible} className="content">
                    {
                        props.load.types.map(t => {
                            return <p key={t.type}>
                                <p><strong>{`${printType(t.type)}`}</strong>{`, ${t.hours} часов`}</p>
                            </p>;
                        })
                    }
                </ol>
            </li>
            <li>
                <div  onClick={e => setCommonVisible(!commonVisible)} className={"header " + (commonVisible ? "visible" : "")}>
                    <p>Общая</p>
                </div>
                <p hidden={!commonVisible} className="content">{`${props.load.lessons.map(l => l.hours).reduce((sum, h) => sum + h, 0)} часов`}</p>
            </li>
        </div>
    </div>;
}

export default LoadView;