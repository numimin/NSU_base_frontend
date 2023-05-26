import { abort } from "process";

export type Gender = "NONE" | "MALE" | "FEMALE";
export type SBoolean = "NONE" | "TRUE" | "FALSE";

export interface StudentQuery {
	gender: Gender;
	year: number | null;
	age: number | null;
	hasChildren: SBoolean;
	minScholarship: number | null;
	maxScholarship: number | null;
	groupIds: number[];
	facultyIds: number[];
}

export interface Student {
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

export interface Group {
	id: number;
	name: string;
	facultyId: number;
}

export interface Faculty {
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

export async function getStudents(query: StudentQuery, abortSignal: AbortSignal): Promise<Student[] | null> {
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

export async function getGroup(id: number, abortSignal: AbortSignal): Promise<Group | null> {
	const response = fetch(`/api/group/?id=${id}`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Group>(response);
}

export async function getGroups(facultyIds: number[], abortSignal: AbortSignal): Promise<Group[] | null> {
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

export async function getFaculty(id: number, abortSignal: AbortSignal): Promise<Faculty | null> {
	const response = fetch(`/api/faculty/?id=${id}`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Faculty>(response);
}

export async function getFaculties(abortSignal: AbortSignal): Promise<Faculty[] | null> {
	const response = fetch(`/api/faculties/`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Faculty[]>(response);
}

export type Category = "NONE" | "ASSISTANT" | "ASSISTANT_PROFESSOR" | "PROFESSOR"

export interface DateStruct {
	year: number;
	month: number;
	day: number;
}

export interface Teacher {
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

export interface TeachersQuery {
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

export interface Department {
	id: number;
	name: string;
	facultyId: number;
}

export interface DepartmentsQuery {
	facultyIds: number[];
}

export async function getTeachers(query: TeachersQuery, abortSignal: AbortSignal): Promise<Teacher[] | null> {
	const category = query.category === "NONE" ? "" : `category=${query.category}`
	const gender = query.gender === "NONE" ? "" : `&gender=${query.gender}`
	const hasChildren = query.hasChildren === "NONE" ? "" : `&hasChildren=${query.hasChildren.toLowerCase()}`
	const graduateStudent = query.graduateStudent === "NONE" ? "" : `&graduateStudent=${query.graduateStudent.toLowerCase()}`
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

export async function getDepartments(facultyIds: number[], abortSignal: AbortSignal): Promise<Department[] | null> {
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

export async function getDepartment(id: number, abortSignal: AbortSignal): Promise<Department | null> {
	const response = fetch(`/api/department/?id=${id}`, {
		method: 'GET',
		signal: abortSignal,
	});
	return get<Department>(response);
}

export async function getDissertations(facultyIds: number[], departmentIds: number[], abortSignal: AbortSignal): Promise<string[] | null> {
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

export interface DepartmentLessonQuery {
	groupId: number | null;
	course: number | null;
	facultyId: number | null;
	term: number | null;
	start: DateStruct | null;
	end: DateStruct | null;
}

export async function getDepartmentsFromLessons(query: DepartmentLessonQuery, abortSignal: AbortSignal): Promise<Department[] | null> {
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

export type LessonType = "LECTURE" | "PRACTICE" | "LAB";

export interface Lesson {
	id: number;
    name: string;
    teacherId: number;
    groupId: number;
    term: number;
    course: number;
    type: LessonType;
	hours: number;
}

export interface LessonQuery {
	groupId: number | null;
	course: number | null;
}

export async function getLessons(query: LessonQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/lessons/?" +
		getQuery("groupId", query.groupId) +
		getQuery("course", query.course),
		{
			method: "GET",
			signal: abortSignal,
		});
	return get<Lesson[]>(response);
}

export async function getLessonsPost(groupIds: number[] | null, abortSignal: AbortSignal) {
	const response = fetch("/api/lessons_post",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: groupIds && JSON.stringify({
				groupIds: groupIds,
			}),
			signal: abortSignal,
		});
	return get<Lesson[]>(response);
}

export interface TeacherLessonsQuery {
	groupId: number | null;
	course: number | null;
	lessonId: number | null;
	facultyId: number | null;
}

export async function getTeacherLessons(query: TeacherLessonsQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/teacher_lessons/?" +
		getQuery("groupId", query.groupId) +
		getQuery("course", query.course) +
		getQuery("lessonId", query.lessonId) +
		getQuery("facultyId", query.facultyId),
		{
			method: "GET",
			signal: abortSignal,
		});
	return get<Teacher[]>(response);
}

export async function getTeachersFromPeriod(query: DepartmentLessonQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/teacher_period/?" +
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
	return get<Teacher[]>(response);
}

export interface StudentsWithMarkQuery {
	lessonId: number | null;
	mark: number | null;
	groupIds: number[] | null;
}

export async function getStudentsWithMarks(query: StudentsWithMarkQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/students_with_marks/?" +
		getQuery("lessonId", query.lessonId) +
		getQuery("mark", query.mark),
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: query.groupIds && JSON.stringify({
				groupIds: query.groupIds,
			}),
			signal: abortSignal,
		});
	return get<Student[]>(response);
}

export interface StudentsOfCourseWithMarksQuery {
	course: number | null;
	facultyId: number | null;
	term: number | null;
	marks: number[] | null;
	groupIds: number[] | null;
}

export async function getStudentsOfCourseWithMarks(query: StudentsOfCourseWithMarksQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/students_of_course_with_marks/?" + 
		getQuery("course", query.course) +
		getQuery("facultyId", query.facultyId) + 
		getQuery("term", query.term),
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: query.marks && query.groupIds && JSON.stringify({
			marks: query.marks,
			groupIds: query.groupIds,
		}),
		signal: abortSignal,
	});
	return get<Student[]>(response);
}

export interface TeachersExamsQuery {
	term: number | null;
	groupIds: number[] | null;
	lessonIds: number[] | null;
}

export async function getTeachersByExams(query :TeachersExamsQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/teachers_exams/?" + 
		getQuery("term", query.term),
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				groupIds: query.groupIds ? query.groupIds : [],
				lessonIds: query.lessonIds ? query.lessonIds : [],
			}),
			signal: abortSignal,
		});
	return get<Teacher[]>(response);
}

export interface StudentsExamsQuery {
	teacherId: number | null;
	mark: number | null;
	groupIds: number[] | null;
	lessonIds: number[] | null;
	terms: number[] | null;
	start: DateStruct | null;
	end: DateStruct | null;
}

export async function getStudentsByExams(query: StudentsExamsQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/students_exams/?" + 
		getQuery("teacherId", query.teacherId) +
		getQuery("mark", query.mark),
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				groupIds: query.groupIds ? query.groupIds : [],
				lessonIds: query.lessonIds ? query.lessonIds : [],
				terms: query.terms ? query.terms : [],
				start: query.start ? query.start : {year: -1, month: -1, day: -1},
				end: query.end ? query.end : {year: -1, month: -1, day: -1},
			}),
			signal: abortSignal,
		});
	return get<Student[]>(response);
}

export interface StudentsGraduateWorksQuery {
	departmentId: number | null;
	teacherId: number | null;
}

export interface StudentGraduateWork {
	student: Student;
	graduateWorkTheme: string;
}

export async function getStudentsWithGraduateWorks(query: StudentsGraduateWorksQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/students_graduate_works/?" +
		getQuery("departmentId", query.departmentId) +
		getQuery("teacherId", query.teacherId), 
		{
			method: "GET",
			signal: abortSignal,
		});
	return get<StudentGraduateWork[]>(response);
}

export interface TeachersGraduateWorksQuery {
	departmentId: number | null;
	facultyId: number | null;
	category: Category;
}

export async function getTeachersByGraduateWorks(query: TeachersGraduateWorksQuery, abortSignal: AbortSignal) {
	const category = query.category === "NONE" ? "" : `&category=${query.category}`
	const response = fetch("/api/teachers_graduate_works/?" +
		getQuery("departmentId", query.departmentId) +
		getQuery("facultyId", query.facultyId) + 
		category, 
		{
			method: "GET",
			signal: abortSignal,
		});
	return get<Teacher[]>(response);
}

export interface Type {
	type: LessonType;
	hours: number;
}

export interface Load {
	lessons: Lesson[];
	types: Type[];
}

export async function getTeachersLoad(query: StudentsGraduateWorksQuery, abortSignal: AbortSignal) {
	const response = fetch("/api/teachers_load/?" +
		getQuery("departmentId", query.departmentId) +
		getQuery("teacherId", query.teacherId), 
		{
			method: "GET",
			signal: abortSignal,
		});
	return get<Load>(response);
}

export interface AddStudentQuery {
	firstname: string;
	lastname: string;
	patronymic: string;
	gender: Gender;
	dateOfBirth: DateStruct;
	hasChildren: boolean;
	scholarship: number;
	groupId: number;
}

export interface Result {
	result: boolean;
	message: string;
}

export async function addStudent(query: AddStudentQuery, abortSignal?: AbortSignal): Promise<Result | null> {
	const response = fetch('/api/student/add',
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(query),
		signal: abortSignal
	});
	return get<Result>(response);
}

export async function deleteStudent(id: number, abortSignal?: AbortSignal): Promise<Result | null> {
	const response = fetch(`/api/student/delete?id=${id}`, {
		method: "POST",
		signal: abortSignal
	});
	return get<Result>(response);
}

export async function updateStudent(id: number, query: AddStudentQuery, abortSignal?: AbortSignal): Promise<Result | null> {
	const response = fetch(`/api/student/update?id=${id}`,
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(query),
		signal: abortSignal
	});
	return get<Result>(response);
}

export interface AddTeacherQuery {
	firstname: string,
	lastname: string,
	patronymic: string,
	category: Category,
	gender: Gender,
	hasChildren: boolean,
	salary: number,
	graduateStudent: boolean,
	phdThesisDate: DateStruct | null,
	departmentId: number,
	phdDissertation: string | null,
	doctoralDissertation: string | null,
}

export async function addTeacher(query: AddTeacherQuery, abortSignal?: AbortSignal): Promise<Result | null> {
	const response = fetch('/api/teacher/add',
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(query),
		signal: abortSignal
	});
	return get<Result>(response);
}

export async function deleteTeacher(id: number, abortSignal?: AbortSignal): Promise<Result | null> {
	const response = fetch(`/api/teacher/delete?id=${id}`, {
		method: "POST",
		signal: abortSignal
	});
	return get<Result>(response);
}