'use client'

import AuthProvider from './AuthProvider'
import QueryProvider from './QueryProvider'
import RecoilProvider from './RecoilProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<RecoilProvider>
				<QueryProvider>{children}</QueryProvider>
			</RecoilProvider>
		</AuthProvider>
	)
}
