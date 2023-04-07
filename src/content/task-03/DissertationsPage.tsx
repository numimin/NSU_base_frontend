import {useState, useEffect} from 'react';
import Dissertations from './Dissertations';
import DissertationsForm from './DissertationsForm';
import {getDissertations} from '../../api/nsu_base';

function DissertationsPage() {
	const [dissertations, setDissertations] = useState<string[]>([]);
	const [facultyIds, setFacultyIds] = useState<number[]>([]);
	const [departmentIds, setDepartmentIds] = useState<number[]>([]);

	useEffect(() => {
		let controller: AbortController | null = new AbortController();
		(async () => {
			const response = await getDissertations(facultyIds, departmentIds, controller.signal);
			if (response !== null) {
				setDissertations(response);				
			}
			controller = null;
		}) ();
		return () => controller?.abort();
	}, [facultyIds, departmentIds]);

	return <div className='Split'>
		<DissertationsForm
			facultyIds={facultyIds}
			departmentIds={departmentIds}
			onChange={(f, d) => {
				setFacultyIds(f);
				setDepartmentIds(d);
			}}/>
		<Dissertations dissertations={dissertations}/>
	</div>;
}

export default DissertationsPage;