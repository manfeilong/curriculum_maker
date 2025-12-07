import fs from 'fs';
import path from 'path';

export interface CourseTime {
  day: number;
  period: number;
}

export interface Course {
  serialNo: number;
  classNo: string;
  title: string;
  credit: number;
  teachers: string[];
  times: CourseTime[];
  courseType: string;
  limitCnt: number;
  admitCnt: number;
  waitCnt: number;
  college: string;
  department: string;
}

let cachedCourses: Course[] | null = null;

export function getCourses(): Course[] {
  if (cachedCourses) return cachedCourses;

  try {
    const filePath = path.join(process.cwd(), 'data', 'clean_courses.json');
    console.log("Loading courses from:", filePath);
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist at path:", filePath);
      return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    cachedCourses = JSON.parse(fileContent);
    console.log(`Loaded ${cachedCourses?.length} courses.`);
    return cachedCourses || [];
  } catch (error) {
    console.error("Failed to load courses:", error);
    return [];
  }
}

export interface SearchFilters {
  query?: string;
  college?: string;
  department?: string;
  day?: number;
  period?: number;
  courseType?: string;
}

export function searchCourses(filters: SearchFilters): Course[] {
  const courses = getCourses();
  const { query, college, department, day, period, courseType } = filters;
  const lowerQuery = query?.toLowerCase() || '';

  return courses.filter(c => {
    // Text Search
    if (lowerQuery) {
      const matchTitle = c.title.toLowerCase().includes(lowerQuery);
      const matchTeacher = c.teachers.some(t => t.toLowerCase().includes(lowerQuery));
      const matchCode = c.classNo.toLowerCase().includes(lowerQuery);
      if (!matchTitle && !matchTeacher && !matchCode) return false;
    }

    // College & Department
    if (college && c.college !== college) return false;
    if (department && c.department !== department) return false;

    // Time
    if (day !== undefined || period !== undefined) {
      const hasTime = c.times.some(t => {
        const dayMatch = day === undefined || t.day === day;
        const periodMatch = period === undefined || t.period === period;
        return dayMatch && periodMatch;
      });
      if (!hasTime) return false;
    }

    // Course Type
    if (courseType && c.courseType !== courseType) return false;

    return true;
  }).slice(0, 100); // Limit results for performance
}

export function getCourseBySerial(serialNo: number): Course | undefined {
  return getCourses().find(c => c.serialNo === serialNo);
}
