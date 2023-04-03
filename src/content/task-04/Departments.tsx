import {Department} from '../../api/nsu_base';

function Departments(props: {departments: Department[]}) {
	return <>
		<h2>Кафедры</h2>
		<ol>
			{
				props.departments.map(department => {
					return <li>
						<p>{department.name}</p>
					</li>;
				})
			}
		</ol>
	</>;
}

export default Departments;