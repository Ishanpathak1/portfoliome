"use client";
import { useMemo } from "react";

export default function CoverLetterDemoPage() {
	const isPdfMode = useMemo(() => {
		if (typeof window === 'undefined') return false;
		return new URLSearchParams(window.location.search).get('pdf') === '1';
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 py-12 print:bg-white print:py-0">
			<div className={`mx-auto px-4 print:max-w-none ${isPdfMode ? 'max-w-none' : 'max-w-4xl'}`}>
				{/* Page header */}
				<div className="mb-8 flex items-center justify-between print:hidden">
					<h1 className="text-2xl font-bold text-gray-900">Cover Letter Demo</h1>
					<div className="flex items-center gap-3">
						<a
							href="/api/cover-letter-demo/pdf"
							className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
						>
							Exact PDF
						</a>
						<button
							onClick={() => window.print()}
							className="inline-flex items-center rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
						>
							Download PDF
						</button>
						<a href="/" className="text-sm text-purple-600 hover:text-purple-700">Back home</a>
					</div>
				</div>

				{/* Letter card */}
				<div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-0 print:rounded-none a4-page ${isPdfMode ? 'scale-[0.98]' : ''}`}
					style={isPdfMode ? { height: '1123px' } : undefined}
				>
					{/* Top accent bar kept thin to save vertical space */}
					<div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600" />
					<div className="p-8 sm:p-10">
						{/* Letterhead */}
						<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
							<div>
								<h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Alex Johnson</h2>
								<p className="text-gray-600">Senior Product Manager</p>
							</div>
							<div className="text-sm text-gray-500">
								<div className="flex flex-wrap gap-x-4 gap-y-1">
									<span>alex.johnson@hey.com</span>
									<span>•</span>
									<span>+1 (555) 123-4567</span>
									<span>•</span>
									<span>San Francisco, CA</span>
								</div>
								<div className="mt-1">linkedin.com/in/alex-johnson</div>
							</div>
						</div>

						<hr className="my-6 border-gray-200" />

						{/* Meta (date + company) */}
						<div className="text-sm text-gray-600 space-y-1 mb-6">
							<div>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
							<div className="font-medium text-gray-900">Hiring Manager</div>
							<div>Acme Robotics</div>
							<div>123 Market Street, San Francisco, CA</div>
						</div>

						{/* Body */}
						<div className="space-y-5 leading-relaxed text-gray-800">
							<p className="font-medium">Dear Hiring Manager,</p>
							<p>
								I am excited to apply for the Senior Product Manager role at Acme Robotics. Over the past 7+ years, I have shipped AI-powered platform features at growth-stage startups, leading cross-functional pods to deliver outcomes that combine user value with measurable business impact.
							</p>
							<p>
								At Nimbus, I drove the launch of an ML-ranking overhaul for our marketplace, increasing qualified matches by 31% and reducing time-to-value by 18%. I partnered closely with data science and design to validate hypotheses, ran iterative experiments, and built a roadmap that balanced short-term wins with foundational work.
							</p>
							<p>
								Previously at Atlas Health, I led a patient-intake reimagining that cut drop-off by 22% and lifted NPS by 9 points. My approach centers on crisp problem frames, customer interviews, and clear success metrics—paired with empathetic collaboration across engineering, design, and GTM.
							</p>
							<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
								<ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
									<li><span className="font-medium">Impact:</span> +31% qualified matches, -18% TTV, +9 NPS via ML and UX improvements</li>
									<li><span className="font-medium">Leadership:</span> Led squads of 6–10 across DS, Eng, Design, and Research</li>
									<li><span className="font-medium">Tooling:</span> Amplitude, Mixpanel, dbt/SQL, Figma, Jira; strong comfort with AI copilots</li>
								</ul>
							</div>
							<p>
								Acme’s mission to bring safe, practical robotics into everyday workflows resonates with me. I’d be eager to partner with your robotics and platform teams to define clear problem statements, align constraints, and accelerate the path from concept to repeatable value.
							</p>
							<p>
								Thank you for your time—I would welcome the opportunity to discuss how I can contribute to Acme’s roadmap.
							</p>
							<p className="mt-6">Sincerely,</p>
							<p className="font-semibold">Alex Johnson</p>
						</div>

						{/* Footer note removed to save vertical space */}
					</div>
				</div>

				{/* Helper tips */}
				<div className="mt-6 text-sm text-gray-600 print:hidden">
					<p>
						This is a static demo using HTML + Tailwind CSS. In the real flow, we render AI-generated content into these blocks and support quick edits and export.
					</p>
				</div>
			</div>
		</div>
	);
}


