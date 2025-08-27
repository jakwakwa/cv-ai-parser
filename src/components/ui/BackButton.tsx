"use client"

import { useRouter } from "next/navigation"
import type React from "react"

const BackButton: React.FC = () => {
	const router = useRouter()

	return (
		<button
			type="button"
			onClick={() => router.back()}
			className="my-12 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
			&larr; Back
		</button>
	)
}

export default BackButton
