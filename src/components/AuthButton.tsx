'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
	const { data: session } = useSession()

	if (session) {
		return (
			<div className="flex items-center gap-4">
				<p>Signed in as {session.user?.email}</p>
				<button
					onClick={() => signOut()}
					className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				>
					Sign out
				</button>
			</div>
		)
	}
	return (
		<div className="flex items-center gap-4">
			<p>Not signed in</p>
			<button
				onClick={() => signIn('google')}
				className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			>
				Sign in with Google
			</button>
		</div>
	)
}
