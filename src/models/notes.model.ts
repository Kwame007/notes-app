// export interface Note {
//   id?: string;
//   title: string;
//   content: string;
//   createdAt: Date;
//   updatedAt: Date;
//   archived: boolean;
//   tags: string[];
// }
export interface Note {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  isArchived: boolean;
  updated_at?: string;
  created_at?: string;
  user_id: string;
}
