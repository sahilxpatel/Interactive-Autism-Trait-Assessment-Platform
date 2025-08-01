// src/components/home/Footer.tsx
import { BrainCircuit, BookOpen, LifeBuoy, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BrainCircuit size={28} className="text-blue-400" />
              <span className="text-xl font-bold text-white">Autism Assessment</span>
            </div>
            <p className="mb-4">
              Professional autism spectrum assessment tools developed with clinical experts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><BookOpen size={14} /> Autism Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><BookOpen size={14} /> Assessment Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><BookOpen size={14} /> Professional Tools</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><LifeBuoy size={14} /> Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><LifeBuoy size={14} /> Contact Specialists</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><LifeBuoy size={14} /> Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Organization</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clinical Advisors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Research Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Share2 size={14} /> Share Platform</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Autism Assessment Platform. All rights reserved.</p>
          <p className="mt-2 text-gray-500">For professional use only. Not a diagnostic tool.</p>
        </div>
      </div>
    </footer>
  );
}