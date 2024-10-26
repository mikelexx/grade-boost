export interface FileMaterial {
  id?: string;
  authorId: string;
  authorName?: string;
  authorPhotoUrl?: string;
  fileName: string;
  materialType: string;
  courseCode?: string;
  fieldOfStudy?: string;
  fileNameTags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  downloads?: number | string;
  fieldOfStudyTags?: string[]
}
