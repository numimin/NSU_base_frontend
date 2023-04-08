import {Department} from '../../api/nsu_base';

function Departments(props: {departments: Department[]}) {
	return <div className='List'>
		<h2>Кафедры</h2>
		<ol>
			{
				props.departments.map(department => {
					return <li key={department.id}>
						<p className='header not_expandable'>{department.name}</p>
					</li>;
				})
			}
		</ol>
	</div>;
}

export default Departments;