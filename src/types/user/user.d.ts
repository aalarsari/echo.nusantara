interface User {
   [key: string]: any;
   id?: number;
   name: string;
   email?: string;
   address?: string | null;
   city?: string | null;
   country?: string | null;
   longitude?: number | null;
   latitude?: number | null;
   postalCode?: string | null;
   photo?: string;
   phone?: string;
   lastLogin?: Date | null;
   createdAt?: string | Date | null;
   createdBy?: string | null;
   updateAt?: string | Date | null;
   updateBy?: string | null;
}
