import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - CarSite Kenya',
  description: 'Frequently asked questions about buying, selling, and financing cars in Kenya.',
}

const faqs = [
  {
    category: 'Buying a Car',
    questions: [
      {
        question: 'What documents do I need to buy a car?',
        answer: 'You will need valid identification (National ID or Passport), proof of address, and if financing, proof of income and bank statements.',
      },
      {
        question: 'Can I import a car from abroad?',
        answer: 'Yes, we can assist with the import process. We handle customs clearance, registration, and delivery to your location.',
      },
      {
        question: 'Do you offer test drives?',
        answer: 'Yes, we offer test drives for all our vehicles. You can schedule one through our contact page or visit our showroom.',
      },
    ],
  },
  {
    category: 'Selling Your Car',
    questions: [
      {
        question: 'How do I get a quote for my car?',
        answer: 'Simply fill out the sell your car form on our website with your vehicle details. Our team will get back to you within 24 hours.',
      },
      {
        question: 'How long does the selling process take?',
        answer: 'The process typically takes 1-3 days from evaluation to payment, depending on documentation completeness.',
      },
    ],
  },
  {
    category: 'Financing',
    questions: [
      {
        question: 'What financing options do you offer?',
        answer: 'We offer bank financing through our partners and in-house financing options. Interest rates start from 12% APR.',
      },
      {
        question: 'How much can I borrow?',
        answer: 'We offer financing up to 80% of the vehicle value, subject to credit approval.',
      },
      {
        question: 'What is the repayment period?',
        answer: 'Repayment periods range from 12 to 72 months, depending on the financing option you choose.',
      },
    ],
  },
  {
    category: 'Delivery & Warranty',
    questions: [
      {
        question: 'Do you offer delivery?',
        answer: 'Yes, we offer nationwide delivery. Delivery fees vary based on location within Kenya.',
      },
      {
        question: 'What warranty do you offer?',
        answer: 'All our vehicles come with a minimum 3-month mechanical warranty. Extended warranties are available for purchase.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="bg-[var(--primary)] py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-white/80">Find answers to common questions</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((category) => (
            <div key={category.category} className="bg-white rounded-lg border border-[var(--border)] p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <div key={index} className="border-b border-[var(--border)] pb-4 last:border-0">
                    <h3 className="font-medium text-[var(--foreground)] mb-2">{faq.question}</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto bg-[var(--primary)] rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Still Have Questions?</h2>
          <p className="text-white/80 mb-4">Contact our team for personalized assistance.</p>
          <a href="/contact" className="inline-block px-6 py-3 bg-white text-[var(--primary)] font-medium rounded-md hover:bg-[var(--background-alt)]">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
