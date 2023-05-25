import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const [visible, setVisible] = useState(-1);
    const [hovered, setHovered] = useState(-1);

    const navigate = useNavigate();

    return <>
        <div onClick={e => navigate("/")} className='Header' onMouseEnter={e => setVisible(-1)}>
            <p>База НГУ</p>
        </div>
        <ol className='Nav'>
            <li onMouseEnter={e => setVisible(0)}>ОБЩИЕ</li>
            <li onMouseEnter={e => setVisible(1)}>ЗАНЯТИЯ</li>
            <li onMouseEnter={e => setVisible(2)}>ОЦЕНКИ И ЭКЗАМЕНЫ</li>
            <li onMouseEnter={e => setVisible(3)}>ДИПЛОМНЫЕ РАБОТЫ</li>
            <img onClick={e => navigate("/edit")} className="EditIcon" src='/icons/edit.png'/>
        </ol>
        <ol className='NavList'>
            <li onMouseEnter={e => setHovered(0)} onMouseLeave={e => {
            setHovered(-1);
            setVisible(-1);
            }} hidden={visible !== 0 && hovered !== 0}>
            <ol className='MicroNav'>
                <li><a href="/tasks/task-01">Студенты</a></li>
                <li><a href="/tasks/task-02">Преподаватели</a></li>
                <li><a href="/tasks/task-03">Диссертации</a></li>
                <li><a href="/tasks/task-13">Нагрузка</a></li>
            </ol>
            </li>
            <li onMouseEnter={e => setHovered(1)} onMouseLeave={e => {
            setHovered(-1);
            setVisible(-1);
            }} hidden={visible !== 1 && hovered !== 1}>
            <ol className='MicroNav'>
                <li><a href="/tasks/task-04">Кафедры</a></li>
                <li><a href="/tasks/task-05">Преподаватели</a></li>
                <li><a href="/tasks/task-06">Преподаватели за указанный период</a></li>
            </ol>
            </li>
            <li onMouseEnter={e => setHovered(2)} onMouseLeave={e => {
            setHovered(-1);
            setVisible(-1);
            }} hidden={visible !== 2 && hovered !== 2}>
            <ol className='MicroNav'>
                <li><a href="/tasks/task-07">Студенты, сдавшие зачет</a></li>
                <li><a href="/tasks/task-08">Студенты, сдавшие сессию</a></li>
                <li><a href="/tasks/task-09">Преподаватели, принимавшие экзамены</a></li>
                <li><a href="/tasks/task-10">Студенты, получившие оценку</a></li>
            </ol>
            </li>
            <li onMouseEnter={e => setHovered(3)} onMouseLeave={e => {
            setHovered(-1);
            setVisible(-1);
            }} hidden={visible !== 3 && hovered !== 3}>
            <ol className='MicroNav'>
                <li><a href="/tasks/task-11">Студенты и темы дипломов</a></li>
                <li><a href="/tasks/task-12">Руководители дипломных работ</a></li>
            </ol>
            </li>
        </ol>
    </>;
}

export default Header;