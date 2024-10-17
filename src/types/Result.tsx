export interface Result {
  id: string;
  fileName: string;
  materialType: string;
  downloads?: number | string; // Allow number or string
  uploadedAt: Date | string; // Allow Date or string for 'time'
  thumbnailUrl: string;
  authorPhotoUrl?: string;
  courseCode ?: string;
  authorName ?: string;
  fieldOfStudy ?: string;
  fileUrl ?: string;
  fileNameTags?: any[];

}
