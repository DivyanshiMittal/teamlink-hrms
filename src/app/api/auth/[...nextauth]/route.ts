import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Additional providers can be added here (e.g., Google, GitHub)

// Define User Role Types
export type Role = 'Admin' | 'HR Manager' | 'Employee';

// Module augmentation to add role to Session
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: Role;
        } & DefaultSession['user'];
    }

    interface User {
        role: Role;
    }
}

// Module augmentation to add role to JWT
declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: Role;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Placeholder for actual database lookup
                // In a real application, you would:
                // 1. connectToDatabase()
                // 2. Find user by email
                // 3. Verify password hash

                if (credentials?.email === 'admin@hrms.local') {
                    return { id: '1', name: 'Admin User', email: 'admin@hrms.local', role: 'Admin' };
                } else if (credentials?.email === 'hr@hrms.local') {
                    return { id: '2', name: 'HR Manager', email: 'hr@hrms.local', role: 'HR Manager' };
                } else if (credentials?.email === 'employee@hrms.local') {
                    return { id: '3', name: 'Employee', email: 'employee@hrms.local', role: 'Employee' };
                }

                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        // signIn: '/auth/signin', // Can be uncommented when custom signin page is built
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
