"use client"

export function DoctorFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-5 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Locations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Treatments</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Dental
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Cardio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Spinal Cord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Neurology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Aroend & Disorder
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Specialities</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Transplant
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Cardiotripipe
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Oncology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Pulmonology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Gynecology
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Utilities</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Request A Quote
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Premium Membership
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-3">Subscribe & Stay updated from the Doccare</p>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition">
                Join
              </button>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-600 hover:text-white rounded flex items-center justify-center transition text-xs"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-600 hover:text-white rounded flex items-center justify-center transition text-xs"
              >
                t
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-600 hover:text-white rounded flex items-center justify-center transition text-xs"
              >
                in
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-600 hover:text-white rounded flex items-center justify-center transition text-xs"
              >
                ig
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-600 hover:text-white rounded flex items-center justify-center transition text-xs"
              >
                p
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <p>Copyright © 2025 TailBuddies. All Rights Reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">
              Legal Notice
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600">
              Refund Policy
            </a>
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-8 bg-gray-200 rounded text-xs flex items-center justify-center">VISA</div>
            <div className="h-5 w-8 bg-gray-200 rounded text-xs flex items-center justify-center">MC</div>
            <div className="h-5 w-8 bg-gray-200 rounded text-xs flex items-center justify-center">MA</div>
            <div className="h-5 w-8 bg-gray-200 rounded text-xs flex items-center justify-center">PP</div>
            <div className="h-5 w-8 bg-gray-200 rounded text-xs flex items-center justify-center">ST</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
