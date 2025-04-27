import React from 'react';
import { HelpCircle, Book, Mail, Phone } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <button className="flex justify-between w-full text-left font-medium text-gray-900">
              <span>How do I check-in a new guest?</span>
              <HelpCircle size={20} className="text-blue-600" />
            </button>
            <div className="mt-2 text-gray-600">
              <p>To check-in a new guest, go to the "Check In" page from the sidebar. You can either select an existing guest or create a new guest profile. Then, select an available room, specify the check-in date, and complete the check-in process.</p>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <button className="flex justify-between w-full text-left font-medium text-gray-900">
              <span>How do I check-out a guest?</span>
              <HelpCircle size={20} className="text-blue-600" />
            </button>
            <div className="mt-2 text-gray-600">
              <p>To check-out a guest, navigate to the "Check Out" page. Select the guest's active stay from the list, specify the check-out date, update payment status if needed, and complete the check-out process.</p>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <button className="flex justify-between w-full text-left font-medium text-gray-900">
              <span>How can I view all guest records?</span>
              <HelpCircle size={20} className="text-blue-600" />
            </button>
            <div className="mt-2 text-gray-600">
              <p>You can view all guest records by navigating to the "Guests" page. This page displays a directory of all guests with their details. You can search for specific guests using the search bar.</p>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <button className="flex justify-between w-full text-left font-medium text-gray-900">
              <span>How do I export stay records?</span>
              <HelpCircle size={20} className="text-blue-600" />
            </button>
            <div className="mt-2 text-gray-600">
              <p>To export stay records, go to the "Records" page and click on the "Export CSV" button. This will download a CSV file containing all the currently filtered stay records.</p>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <button className="flex justify-between w-full text-left font-medium text-gray-900">
              <span>Can I edit guest information?</span>
              <HelpCircle size={20} className="text-blue-600" />
            </button>
            <div className="mt-2 text-gray-600">
              <p>Yes, you can edit guest information. Go to the "Guests" page, find the guest you want to edit, and click on the edit (pencil) icon. Make your changes in the form that appears and save them.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Need More Help?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Book size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">User Manual</h3>
            <p className="text-gray-600 mb-4">View the complete user manual for detailed instructions on using all features.</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View Manual
            </button>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Have a specific question? Send us an email and we'll get back to you.</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Contact Support
            </button>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Need immediate assistance? Call our support team.</p>
            <p className="text-blue-600 font-medium">+91 1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;