import { ArrowRight } from 'lucide-react';
import Footer from '../../components/layout/Footer/Footer';
import { useEffect, useState } from 'react';

const Landing = () => {

  const [ data, setData ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_baseURL}/test`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json(); // Call the json() method
        setData(data);
        console.log(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
       
      }
    };
    fetchData();
  },[])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center">
              <div className="mr-2">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="24" height="24" fill="#0A2463" />
                  <rect x="24" y="0" width="16" height="16" fill="#E63946" />
                </svg>
              </div>
              <div className="text-2xl font-semibold">
                <span className="text-red-500">Wealth</span> <span className="text-blue-900">Coop</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-700 hover:text-blue-900">Log In</button>
              <button className="border border-blue-900 rounded px-4 py-1 text-blue-900 hover:bg-blue-900 hover:text-white">Sign Up</button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="md:w-1/2 mb-8 md:mb-0 pr-4">
              <h2 className="text-4xl font-bold text-blue-900 leading-tight mb-6">
                Trusted Financial Partner of Your Future
              </h2>
              <p className="text-gray-700 mb-8">
                We are committed to providing exceptional banking services that empower our members and community. 
                Our cooperative approach ensures that our customers are at the heart of everything we do, offering 
                personalized solutions to meet your financial needs.
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md font-medium">
                Join With Us Now
              </button>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-full bg-blue-900 h-64 w-64 absolute right-0 top-0 overflow-hidden">
                <img 
                  src="/api/placeholder/300/300" 
                  alt="Woman on phone" 
                  className="object-cover" 
                />
              </div>
              <div className="rounded-full bg-red-500 h-48 w-48 absolute left-0 bottom-0 overflow-hidden">
                <img 
                  src="/api/placeholder/240/240" 
                  alt="Woman with laptop" 
                  className="object-cover" 
                />
              </div>
              <div className="absolute top-8 left-16 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                All your Banking Needs
              </div>
              <div className="absolute top-16 left-24 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                All in One Place
              </div>
              <div className="absolute top-24 left-6 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                The Bank That begins With
              </div>
              <div className="absolute top-32 left-16 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                The Tradition of Trust...
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg shadow-md p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gray-200 rounded-l-full z-0"></div>
          <div className="relative z-10 mb-12 text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">
              Get in Touch with the <span className="underline">Modern</span> Banking
            </h2>
            <p className="max-w-3xl mx-auto text-gray-700">
              Our cooperative approach ensures that our customers are at the heart of everything we do, offering personalized solutions
              to meet your financial needs.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row mt-20">
            <div className="md:w-1/2 z-10">
              <h3 className="text-3xl font-bold text-blue-900 mb-6">
                An all-in-one<br />
                Banking app for All<br />
                your financial Needs
              </h3>
              <div className="mb-6">
                <div className="flex items-start mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Easy Account Management</span>
                </div>
                <div className="flex items-start mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Fund Transfers in Few Steps</span>
                </div>
                <div className="flex items-start mb-4">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Bill and Utility Payments</span>
                </div>
              </div>
              <a href="#" className="inline-flex items-center text-blue-900 hover:text-blue-700 font-medium">
                Get the app now <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div className="md:w-1/2 relative z-10 mt-8 md:mt-0">
              <div className="rounded-lg shadow-lg bg-white p-4 flex justify-center mb-8">
                <img 
                  src="/api/placeholder/350/200" 
                  alt="Banking app interface" 
                  className="w-full h-auto object-cover rounded" 
                />
              </div>
              <div className="flex justify-between space-x-4">
                <div className="bg-white rounded-lg shadow p-4 flex-1">
                  <h4 className="text-red-500 font-medium mb-1">Saving Products</h4>
                  <p className="text-xs text-gray-600">
                    Our saving product gives you the ultimate experience of customer-friendly banking service.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex-1">
                  <h4 className="text-red-500 font-medium mb-1">Loan Facilities</h4>
                  <p className="text-xs text-gray-600">
                    Loan facilities that help you build your life in serious ways.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex-1">
                  <h4 className="text-red-500 font-medium mb-1">Term Deposits</h4>
                  <p className="text-xs text-gray-600">
                    Introducing wealth bank fixed deposits with the highest rates in the country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      <Footer/>
      </div>
    </div>
  );
};

export default Landing;