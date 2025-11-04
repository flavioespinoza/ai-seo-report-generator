import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const authOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	session: {
		strategy: 'jwt' as const
	},
	callbacks: {
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session?.user) {
				session.user.id = token.sub as string
			}
			return session
		}
	}
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
