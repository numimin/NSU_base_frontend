import { StudentGraduateWork } from "../../api/nsu_base";
import StudentView from "../task-01/StudentView";

function StudentsGraduateWorks(props: {update: () => void, students: StudentGraduateWork[]}) {
    return <ol className="List">
        <h2>Студенты и работы</h2>
        <div>
        {
            props.students.map(s => {
                return <li>
                    <StudentView update={() => {
                        props.update();
                    }} student={s.student} theme={s.graduateWorkTheme}/>
                </li>;
            })
        }
       </div>
    </ol>;
}

export default StudentsGraduateWorks;