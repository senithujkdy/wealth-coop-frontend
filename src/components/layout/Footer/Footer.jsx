import Logo from "../../../assets/Logo.png";

function Footer() {
  return (
    <>
      <footer className="py-8">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="mr-2">
                <img className="w-5 h-5" 
                src={Logo} alt="" />
              </div>
              <div className="text-xl font-semibold">
                <span className="text-red-500">Wealth</span>{" "}
                <span className="text-blue-900">Coop</span>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-0">
            <h5 className="font-semibold text-gray-700 mb-3">Resources</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-6 md:mb-0">
            <h5 className="font-semibold text-gray-700 mb-3">Support</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Wealth Cooperative Bank
                </a>
              </li>
              <li>
                <p className="text-gray-600">
                  251/41, Kirula Road, Colombo 05
                  <br />
                  Sri Lanka
                </p>
              </li>
              <li>
                <p className="text-gray-600">+94 112 081 281</p>
              </li>
              <li>
                <a
                  href="mailto:info@wealthcoopbank.lk"
                  className="text-gray-600 hover:text-blue-900"
                >
                  info@wealthcoopbank.lk
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Company</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-900">
                  Events
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Copyright © 2025 All Rights Reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-900">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-900">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-900">
                Contact
              </a>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">EN</span>
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
