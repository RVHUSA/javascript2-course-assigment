export interface User {
  id: string;
  name: string;
  email?: string; 
  avatar?: string;
}

export interface Post {
  id?: string;
  title: string;
  body: string;
  owner?: User;  
  published?: string;
  created?: string;
}
