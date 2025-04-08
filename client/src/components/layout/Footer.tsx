import React from 'react';
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New footer navigation section with columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Company</span>
                </Link>
              </li>
              <li>
                <Link href="/our-team">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Our Team</span>
                </Link>
              </li>
              <li>
                <Link href="/our-approach">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Our Approach</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/valuation-services">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Business Valuation</span>
                </Link>
              </li>
              <li>
                <Link href="/buyer-matches">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Buyer Matching</span>
                </Link>
              </li>
              <li>
                <Link href="/data-room">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Data Room</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/industry-insights">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Industry Insights</span>
                </Link>
              </li>
              <li>
                <Link href="/european-markets">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">European Markets</span>
                </Link>
              </li>
              <li>
                <Link href="/success-stories">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Success Stories</span>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">FAQs</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <span className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</span>
                </Link>
              </li>
              <li>
                <span className="text-gray-400 text-sm">info@mandainstitute.com</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">+44 (0) 20 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Legal links in a single row */}
        <div className="border-t border-gray-800 pt-4">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-y-2 gap-x-3 sm:gap-4 text-xs text-gray-400">
            <Link href="/privacy">
              <span className="hover:text-white transition-colors">Privacy</span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-white transition-colors">Terms</span>
            </Link>
            <Link href="/cookies">
              <span className="hover:text-white transition-colors">Cookies</span>
            </Link>
            <Link href="/accessibility">
              <span className="hover:text-white transition-colors">Accessibility</span>
            </Link>
            <Link href="/compliance">
              <span className="hover:text-white transition-colors">Compliance</span>
            </Link>
            <Link href="/faq">
              <span className="hover:text-white transition-colors">FAQ</span>
            </Link>
          </div>
          <div className="mt-4 text-center text-gray-400 text-xs">
            <p>©2025 MANDA INSTITUTE. All rights reserved.</p>
            <p className="mt-1">MANDA INSTITUTE is part of AIEB.Capital.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}