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

type Category = "NONE" | "ASSISTANT" | "ASSISTANT_PROFESSOR" | "PROFESSOR"

interface DateStruct {
	year: number;
	month: number;
	day: number;
}

interface Teacher {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
	category: Category;
	gender: Gender;
	hasChildren: boolean;
	salary: number;
	graduateStudent: boolean;
	phdThesisDate: string;
	departmentId: number;
}

interface TeachersQuery {
	category: Category;
	gender: Gender;
	hasChildren: SBoolean;
	minSalary: number | null;
	maxSalary: number | null;
	graduateStudent: SBoolean;
	facultyIds: number[];
	departmentIds: number[];
	phdThesisStartDate: DateStruct | null;
	phdThesisEndDate: DateStruct | null;
}

interface Department {
	id: number;
	name: string;
	facultyId: number;
}

interface DepartmentsQuery {
	facultyIds: number[];
}

async function getTeachers(query: TeachersQuery, abortSignal: AbortSignal): Promise<Teacher[] | null> {
	const category = query.category === "NONE" ? "" : `category=${query.category}`
	const gender = query.gender === "NONE" ? "" : `&gender=${query.gender}`
	const hasChildren = query.hasChildren === "NONE" ? "" : `&hasChildren=${query.hasChildren.toLowerCase()}`
	const graduateStudent = query.graduateStudent === "NONE" ? "" : `&graduateStudent=${query.graduateStudent.toLowerCase()}`
	query.phdThesisStartDate && query.phdThesisStartDate.day++;
	query.phdThesisStartDate && query.phdThesisStartDate.month++;
	query.phdThesisEndDate && query.phdThesisEndDate.day++;
	query.phdThesisEndDate && query.phdThesisEndDate.month++;
	const response = fetch(`/api/teachers/?${gender}` + 
						   category +
						   hasChildren +
						   getQuery("minSalary", query.minSalary) +
						   getQuery("maxSalary", query.maxSalary) +
						   graduateStudent,
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			faculties: query.facultyIds || [],
			departments: query.departmentIds || [],
			phdThesisStartDate: query.phdThesisStartDate || {year: -1, month: -1, day: -1},
			phdThesisEndDate: query.phdThesisEndDate || {year: -1, month: -1, day: -1}
		}),
		signal: abortSignal
	});
	return get<Teacher[]>(response);
}

async function getDepartments(facultyIds: number[], abortSignal: AbortSignal): Promise<Department[] | null> {
	const response = fetch(`/api/departments/`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			faculties: facultyIds ? facultyIds : [],
		}),
		signal: abortSignal,
	});
	return get<Department[]>(response);
}

async function getDepartment(id: number, abortSignal: AbortSignal): Promise<Department | null> {
	const response = fetch(`/api/department/?id=${id}`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Department>(response);
}

async function getDissertations(facultyIds: number[], departmentIds: number[], abortSignal: AbortSignal): Promise<string[] | null> {
	const response = fetch("/api/dissertations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			faculties: facultyIds ? facultyIds : [],
			departments: departmentIds ? departmentIds : [],
		}),
		signal: abortSignal
	})
	return get<string[]>(response);
}

interface DepartmentLessonQuery {
	groupId: number | null;
	course: number | null;
	facultyId: number | null;
	term: number | null;
	start: DateStruct | null;
	end: DateStruct | null;
}

async function getDepartmentsFromLessons(query: DepartmentLessonQuery, abortSignal: AbortSignal): Promise<Department[] | null> {
	const response = fetch("/api/department_lessons/?" +
		getQuery("groupId", query.groupId) + 
		getQuery("course", query.course) + 
		getQuery("facultyId", query.facultyId) + 
		getQuery("term", query.term), 
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: query.start && query.end && JSON.stringify({
				start: query.start,
				end: query.end
			}),
			signal: abortSignal,
		});
	return get<Department[]>(response);
}

export type {
	SBoolean,
	Gender, 
	StudentQuery,
	Student,
	Group,
	Faculty,
	Teacher,
	Department,
	TeachersQuery,
	DepartmentsQuery,
	Category,
	DateStruct,
	DepartmentLessonQuery,
}

export {
	getStudents,
	getGroup,
	getGroups,
	getFaculty,
	getFaculties,
	getTeachers,
	getDepartments,
	getDepartment,
	getDissertations,
	getDepartmentsFromLessons,
}