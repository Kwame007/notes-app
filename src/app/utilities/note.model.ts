export interface Note {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  is_archived: boolean;
  updated_at?: string;
  created_at?: string;
  user_id: string;
}
