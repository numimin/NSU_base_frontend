type Gender = "NONE" | "MALE" | "FEMALE";

interface StudentQuery {
	gender: Gender;
}

interface Student {
	gender: Gender;
}

async function getStudents(query: StudentQuery, abortSignal: AbortSignal): Promise<Student[] | null> {
	const gender = query.gender === "NONE" ? "" : `gender=${query.gender}`
	const response = fetch(`/api/students/?${gender}`,
	{
		method: 'GET',
		signal: abortSignal
	});
	try {
		console.log(await response);
		const status = (await response).status;
		if (status !== 200) {
			console.log(`Status ${status}`)
			return null;
		}
		return (await (await response).json()) as Promise<Student[]>;
	} catch(e) {
		console.log(e);
		return null;
	}
}

export type {
	Gender, 
	StudentQuery,
	Student,
}

export {
	getStudents,
}