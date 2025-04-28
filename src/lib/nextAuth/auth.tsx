import prisma from "@/database/prisma";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcrypt";
import moment from "moment-timezone";

export const authOptions: NextAuthOptions = {
   session: {
      strategy: "jwt",
   },
   pages: {
      signIn: "/login",
   },
   // adapter: PrismaAdapter(prisma),
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            username: {
               label: "Email",
               type: "email",
            },
            password: {
               label: "Password",
               type: "password",
            },
         },
         async authorize(credentials) {
            if (!credentials?.username && !credentials!.password) {
               return null;
            }
            var user = await prisma.user.findFirst({
               where: {
                  OR: [
                     {
                        active: true,
                        email: credentials?.username,
                     },
                     {
                        active: true,
                        phone: credentials?.username,
                     },
                  ],
               },
            });
            if (user) {
               var compareHash = await bcrypt.compare(credentials?.password!, user.password!);
               if (compareHash) {
                  // Generate a new sessionId for each sign in
                  const sessionId = generateSessionId();
                  // check apakah user pada table seesion
                  var session = await prisma.session.create({
                     data: {
                        sessionToken: sessionId,
                        userId: user.id,
                        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        createAt: moment.tz().format(),
                     },
                  });
                  return {
                     id: user.id.toString(),
                     role: user.role,
                     name: user.name,
                     email: user.address,
                     phone: user.phone,
                     photo: user.photo,
                     sessionId: session!.sessionToken,
                  };
               } else {
                  return null;
               }
            } else {
               return null;
            }
         },
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
   ],

   callbacks: {
      async signIn(credentials) {
         if (credentials.account?.provider == "google") {
            const sessionId = generateSessionId();
            var user = await prisma.user.findFirst({
               where: {
                  email: credentials.user.email!,
               },
            });
            if (!user) {
               var createUser = await prisma.user.create({
                  data: {
                     name: credentials.user.name!,
                     email: credentials.user.email!,
                     active: true,
                     phone: credentials.user.phone! ?? "-",
                     photo: `${process.env.APP_URL!}/images/main.png`,
                     createdBy: credentials.user.name!,
                     updateBy: credentials.user.name!,
                     role: "USER",
                     createdAt: moment.tz().format(),
                     updateAt: moment.tz().format(),
                  },
               });
               var session = await prisma.session.create({
                  data: {
                     sessionToken: sessionId,
                     userId: createUser.id,
                     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                     createAt: moment.tz().format(),
                  },
               });
               credentials.user.id = createUser.id.toString();
               credentials.user.role = createUser.role;
               credentials.user.sessionId = sessionId;
               credentials.user.userId = createUser.id.toString();
            } else {
               var session = await prisma.session.create({
                  data: {
                     sessionToken: sessionId,
                     userId: user.id,
                     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                     createAt: moment.tz().format(),
                  },
               });
               credentials.user.id = user.id.toString();
               credentials.user.userId = user.id.toString();
               credentials.user.role = user.role;
               credentials.user.sessionId = sessionId;
            }
            await prisma.session.deleteMany({
               where: {
                  userId: parseInt(credentials.user.id),
                  NOT: {
                     sessionToken: sessionId,
                  },
               },
            });
         } else {
            await prisma.session.deleteMany({
               where: {
                  userId: parseInt(credentials.user.id),
                  NOT: {
                     sessionToken: credentials.user.sessionId,
                  },
               },
            });
         }
         return true;
      },
      jwt: ({ token, user, trigger, session }) => {
         if (trigger == "update") {
            return {
               ...token,
               role: user.role,
               photo: user.photo,
               phone: user.phone,
               userId: user.id,
               name: user.name,
               email: user.email,
               sessionId: user!.sessionId,
            };
         }
         if (user) {
            return {
               ...token,
               role: user.role,
               photo: user.photo,
               phone: user.phone,
               userId: user.id,
               name: user.name,
               email: user.email,
               sessionId: user!.sessionId,
            };
         } else {
            return token;
         }
      },
      session: ({ session, token, user }) => {
         return {
            ...session,
            user: {
               userId: token.userId,
               role: token.role,
               name: token.name,
               email: token.email,
               photo: token.photo,
               phone: token.phone,
               sessionId: token!.sessionId,
            },
         };
      },
   },
};

function generateSessionId() {
   return Math.random().toString(36).substr(2);
}
