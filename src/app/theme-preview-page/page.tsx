export default function ThemePreview() {
	return (
		<div className="mx-auto max-w-5xl space-y-8 py-12">
			<h1 className="mb-6 text-3xl font-bold">Theme Preview</h1>

			<div className="flex flex-wrap gap-3">
				<button className="btn-primary">Primary</button>
				<button className="btn-secondary">Secondary</button>
				<button className="btn-outline">Outline</button>
				<button className="btn-ghost">Ghost</button>
				<button className="btn-danger">Danger</button>
			</div>

			<div className="card space-y-4 p-6">
				<h2 className="text-lg font-semibold">Card Example</h2>
				<p className="text-gray-600">Body text, spacing, background, and dark mode test.</p>
			</div>

			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Column A</th>
							<th>Column B</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Example 1</td>
							<td>Value 1</td>
						</tr>
						<tr>
							<td>Example 2</td>
							<td>Value 2</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}
