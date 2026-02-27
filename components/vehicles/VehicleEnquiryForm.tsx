'use client'

import React, { useState } from 'react'
import { apiResponse } from '@/lib/utils'

interface VehicleEnquiryFormProps {
  vehicleId: string
  vehicleTitle: string
}

export default function VehicleEnquiryForm({ vehicleId, vehicleTitle }: VehicleEnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in this ${vehicleTitle} and would like to know more details or book a test drive.`
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
      const res = await fetch(`${baseUrl}/api/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: 'form'
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        alert(data.message || 'Failed to send enquiry. Please try again.')
      }
    } catch (error) {
      console.error('Error sending enquiry:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Enquiry Sent!</h3>
        <p className="text-[var(--foreground-muted)] mb-4">We've received your message and will get back to you shortly.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-[var(--primary)] font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8 pt-6 border-t border-[var(--border)]">
      <h3 className="text-base font-bold text-[var(--foreground)] mb-4">
        Interested? Send an Enquiry
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all border-gray-200"
        />
        <input
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all border-gray-200"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all border-gray-200"
        />
        <textarea
          placeholder="Message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all resize-none border-gray-200"
        ></textarea>
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--foreground)] text-white font-bold rounded-lg hover:bg-black transition-all shadow-md disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  )
}
