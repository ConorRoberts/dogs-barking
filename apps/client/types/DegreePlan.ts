export interface Course{
    id: string;
    name: string;
    description: string;
    weight: number;
    nodeId?: string;
    prereqs?: string;
}

export interface Semester{
    id: string;
    name: string;
    timeOfYear: string;
    year: number;
    courses: Course[];
    isEditing: boolean
}

export interface DegreePlan {
    name: string;
    semesters: Semester[];
    department: string;
    number: number;
}

export default DegreePlan;