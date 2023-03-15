export interface User {
  id: string;
  displayName: string;
  username: string;
  image: string;
  joinedAt: Date;
  editedAt?: Date;
}