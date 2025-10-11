export interface User {
  name: string;
  avatar?: string;
}

export interface Post {
  id?: string;
  title: string;
  body: string;
  owner: User;
  published: string; 
}
