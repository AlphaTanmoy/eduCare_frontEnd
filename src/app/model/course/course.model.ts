export interface SubCategory {
  id: string;
  courseCode: string;
  courseName: string;
  dataStatus: string;
  duration: string;
  module: string;
}

export interface ParentCategory {
  id: string;
  courseCode: string;
  courseName: string;
  dataStatus: string;
  subCategories: SubCategory[];
}
