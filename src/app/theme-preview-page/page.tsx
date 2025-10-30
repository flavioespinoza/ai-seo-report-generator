export default function ThemePreview() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Theme Preview</h1>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary">Primary</button>
        <button className="btn-secondary">Secondary</button>
        <button className="btn-outline">Outline</button>
        <button className="btn-ghost">Ghost</button>
        <button className="btn-danger">Danger</button>
      </div>

      <div className="card p-6 space-y-4">
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
            <tr><td>Example 1</td><td>Value 1</td></tr>
            <tr><td>Example 2</td><td>Value 2</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
