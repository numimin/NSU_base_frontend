type Gender = "NONE" | "MALE" | "FEMALE";
type SBoolean = "NONE" | "TRUE" | "FALSE";

interface StudentQuery {
	gender: Gender;
	year: number | null;
	age: number | null;
	hasChildren: SBoolean;
	minScholarship: number | null;
	maxScholarship: number | null;
	groupIds: number[];
	facultyIds: number[];
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
	groupId: number;
}

interface Group {
	id: number;
	name: string;
	facultyId: number;
}

interface Faculty {
	id: number;
	name: string;
}

function getQuery<T>(name: string, t: T): string {
	return t !== null && t !== undefined ? `&${name}=${t}` : "";
}

async function get<T>(response: Promise<Response>): Promise<T | null> {
	try {
		const status = (await response).status;
		if (status !== 200) {
			console.log(`Status: ${status}`);
			return null;
		}
		return (await (await response).json()) as Promise<T>;
	} catch (e) {
		console.log(e);
		return null;
	}
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
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			groups: query.groupIds ? query.groupIds : [],
			faculties: query.facultyIds ? query.facultyIds : [],
		}),
		signal: abortSignal
	});
	return get<Student[]>(response);
}

async function getGroup(id: number, abortSignal: AbortSignal): Promise<Group | null> {
	const response = fetch(`/api/group/?id=${id}`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Group>(response);
}

async function getGroups(facultyIds: number[], abortSignal: AbortSignal): Promise<Group[] | null> {
	const response = fetch(`/api/groups/`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			faculties: facultyIds ? facultyIds : [],
		}),
		signal: abortSignal,
	});
	return get<Group[]>(response);
}

async function getFaculty(id: number, abortSignal: AbortSignal): Promise<Faculty | null> {
	const response = fetch(`/api/faculty/?id=${id}`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Faculty>(response);
}

async function getFaculties(abortSignal: AbortSignal): Promise<Faculty[] | null> {
	const response = fetch(`/api/faculties/`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Faculty[]>(response);
}

export type {
	SBoolean,
	Gender, 
	StudentQuery,
	Student,
	Group,
	Faculty,
}

export {
	getStudents,
	getGroup,
	getGroups,
	getFaculty,
	getFaculties,
}