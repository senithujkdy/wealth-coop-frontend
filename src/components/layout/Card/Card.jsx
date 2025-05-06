import React from 'react'
import { Plus } from 'lucide-react'

const cards = [
    {
      id: 1,
      balance: `Rs 56.00`,
      cardHolder: 'Peter Hans',
      bankName: 'Wealth-COOP',
      cardType: 'VISA',
      validThru: '12/29',
      cardNumber: '3778 **** **** 1234',
      isActive: true,
    },
    // {
    //   id: 2,
    //   balance: 'Rs 5,756',
    //   cardHolder: 'Peter Hans',
    //   validThru: '12/22',
    //   cardNumber: '3778 **** **** 1234',
    //   isActive: false,
    // },
  ];

const Card = ({balance}) => {
  return (
    <>
            {/* Cards Section */}
            <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Cards</h2>
          <button className="flex items-center text-blue-600 font-medium">
            <Plus size={18} className="mr-1" /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
  {cards.map((card) => (
    <div
      key={card.id}
      className={`${
        card.isActive ? 'bg-blue-600' : 'bg-white'
      } rounded-xl p-5 shadow-sm relative overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-sm mb-1`}>Balance</p>
          <p className={`text-2xl font-bold ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.balance}</p>
        </div>
        <div className="text-right">
          <div className={`w-10 h-6 ${card.isActive ? 'bg-white/20' : 'bg-gray-200'} rounded`}></div>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-xs mb-1`}>BANK</p>
          <p className={`font-medium ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.bankName}</p>
        </div>
        <div className="text-right">
          <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-xs mb-1`}>VALID THRU</p>
          <p className={`font-medium ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.validThru}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <p className={`text-xl tracking-widest ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.cardNumber}</p>
        <div className="ml-auto flex space-x-1">
          <div className={`w-6 h-6 ${card.isActive ? 'bg-white/30' : 'bg-gray-200'} rounded-full`}></div>
          <div className={`w-6 h-6 ${card.isActive ? 'bg-white/20' : 'bg-gray-300'} rounded-full`}></div>
        </div>
      </div>
      <div className="mt-4">
        <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-xs mb-1`}>CARD TYPE</p>
        <p className={`font-medium ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.cardType}</p>
      </div>
    </div>
  ))}
</div>
    </>
  )
}

export default Card