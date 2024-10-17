type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export default function timeAgo(uploadDate: string | Date | FirestoreTimestamp) {
  const now = new Date();

  // Check if uploadDate is a Firestore Timestamp
  if (uploadDate && typeof uploadDate === 'object' && 'seconds' in uploadDate) {
    uploadDate = new Date(uploadDate.seconds * 1000); // Convert Firestore Timestamp to Date
  } else {
    uploadDate = new Date(uploadDate); // Convert string or Date to Date if needed
  }

  const diff = now.getTime() - uploadDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

