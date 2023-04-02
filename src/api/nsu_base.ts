type Gender = "NONE" | "MALE" | "FEMALE";
type SBoolean = "NONE" | "TRUE" | "FALSE";

interface StudentQuery {
	gender: Gender;
	year: number | null;
	age: number | null;
	hasChildren: SBoolean;
	minScholarship: number | null;
	maxScholarship: number | null;
}

interface Student {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
	dateOfBirth: string;
	gender: Gender;
	hasChildren: boolean;
	scholarship: number;
}

function getQuery<T>(name: string, t: T): string {
	return t !== null && t !== undefined ? `&${name}=${t}` : "";
}

async function getStudents(query: StudentQuery, abortSignal: AbortSignal): Promise<Student[] | null> {
	const gender = query.gender === "NONE" ? "" : `gender=${query.gender}`
	const hasChildren = query.hasChildren === "NONE" ? "" : `&hasChildren=${query.hasChildren.toLowerCase()}`
	const response = fetch(`/api/students/?${gender}` + 
						   getQuery("year", query.year) +
						   getQuery("age", query.age) +
						   hasChildren +
						   getQuery("minScholarship", query.minScholarship) +
						   getQuery("maxScholarship", query.maxScholarship)
						   ,
	{
		method: 'GET',
		signal: abortSignal
	});
	try {
		const status = (await response).status;
		if (status !== 200) {
			console.log(`Status ${status}`);
			return null;
		}
		return (await (await response).json()) as Promise<Student[]>;
	} catch(e) {
		console.log(e);
		return null;
	}
}

export type {
	SBoolean,
	Gender, 
	StudentQuery,
	Student,
}

export {
	getStudents,
}