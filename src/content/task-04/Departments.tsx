import {Department} from '../../api/nsu_base';

function Departments(props: {departments: Department[]}) {
	return <div>
		<h2 className='ListHeader'>Кафедры</h2>
		<ol className='List'>
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