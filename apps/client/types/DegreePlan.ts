export interface Warning {
    type: string;
    message : string;
    courseID : string;
    
}

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
    year: string;
    courses: Course[];
    isEditing: boolean
}

export interface DegreePlan {
    name: string;
    semesters: Semester[];
    department: string;
    number: number;
    warnings: Warning[];
}

export default DegreePlan;