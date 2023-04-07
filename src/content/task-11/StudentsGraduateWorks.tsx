import { StudentGraduateWork } from "../../api/nsu_base";
import StudentView from "../task-01/StudentView";

function StudentsGraduateWorks(props: {students: StudentGraduateWork[]}) {
    return <ol>
       {
        props.students.map(s => {
            return <li>
                 <StudentView student={s.student}/>
                 <p>{`Тема дипломной работы: ${s.graduateWorkTheme}`}</p>
            </li>;
        })
       }
    </ol>;
}

export default StudentsGraduateWorks;