import { StudentGraduateWork } from "../../api/nsu_base";
import StudentView from "../task-01/StudentView";

function StudentsGraduateWorks(props: {students: StudentGraduateWork[]}) {
    return <ol className="List">
       {
        props.students.map(s => {
            return <li>
                 <StudentView student={s.student} theme={s.graduateWorkTheme}/>
            </li>;
        })
       }
    </ol>;
}

export default StudentsGraduateWorks;