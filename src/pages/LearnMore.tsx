import Header from "@/components/header";
import Footer from "@/components/footer";

const LearnMore: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col bg-white text-slate-900">
			<Header />

			<main className="flex-grow container mx-auto px-4 py-12">
				<header className="max-w-3xl mx-auto text-center mb-12">
					<h1 className="text-4xl font-extrabold mb-4">Learn More — Alay Dugo</h1>
					<p className="text-lg text-slate-700">
						Alay Dugo connects donors, recipients, clinics, and volunteers to
						make blood donations faster, safer, and more effective for the
						community. Learn how the platform works and how you can help save
						lives.
					</p>

					<div className="mt-6 flex justify-center gap-3">
						<a
							href="/create-request"
							className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
						>
							Post a Request
						</a>
						<a
							href="/register"
							className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
						>
							Register as Donor
						</a>
					</div>
				</header>

				<section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
					<div className="prose">
						<h2>Our Mission</h2>
						<p>
							We exist to reduce barriers between people who need blood and
							those who can give it. By combining an intuitive request system
							with verified donor profiles and partner clinic coordination,
							Alay Dugo helps ensure timely, safe, and traceable donations.
						</p>

						<h3>Who we serve</h3>
						<ul>
							<li>Individuals and families in need of blood</li>
							<li>Volunteer donors and donor groups</li>
							<li>Hospitals, clinics, and partner organizations</li>
						</ul>
					</div>

					<div className="prose">
						<h2>How it Works</h2>
						<ol>
							<li>Create an account and complete your profile (blood type, location, availability).</li>
							<li>Search active requests or post a new one with details and urgency.</li>
							<li>Communicate safely via the request page to coordinate logistics.</li>
							<li>Mark donations and update request status when completed.</li>
						</ol>

						<h3>Safety & verification</h3>
						<p>
							We encourage users to verify their identity and clinic partners
							to publish donation receipts where appropriate. Always follow
							medical guidance from your clinic when donating.
						</p>
					</div>
				</section>

				<section className="max-w-5xl mx-auto mb-12">
					<h2 className="text-2xl font-semibold mb-4">Impact</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="p-4 border rounded-md text-center">
							<div className="text-3xl font-bold text-red-600">—</div>
							<div className="text-sm text-slate-600">Requests Fulfilled</div>
						</div>
						<div className="p-4 border rounded-md text-center">
							<div className="text-3xl font-bold text-red-600">—</div>
							<div className="text-sm text-slate-600">Active Donors</div>
						</div>
						<div className="p-4 border rounded-md text-center">
							<div className="text-3xl font-bold text-red-600">—</div>
							<div className="text-sm text-slate-600">Partner Clinics</div>
						</div>
					</div>
				</section>

				<section className="max-w-3xl mx-auto prose">
					<h2>Get Involved</h2>
					<p>
						You can help by registering as a donor, sharing requests with your
						network, volunteering for drives, or partnering as a clinic. Every
						action helps reduce wait times and save lives.
					</p>

					<h3>Need help?</h3>
					<p>
						If you need assistance using the site or have partnership
						questions, visit your profile's contact options or email our admin
						team.
					</p>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default LearnMore;

