import {useState} from 'react';
import {Student} from '../../api/nsu_base';

function Students(props: {students: Student[]}) {
	return <ol>
		{
			props.students.map(student => {
				return <li>
					<p>{`Gender: ${student.gender}`}</p>
				</li>
			})
		}
	</ol>;
}

export {
	Students,
}