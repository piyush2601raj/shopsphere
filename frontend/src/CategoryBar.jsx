import React from 'react';

const CategoryBar = ({ setSelectedCategory }) => {
  const categories = [
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'mobiles', name: 'Mobiles', icon: '📱' },
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'appliances', name: 'Appliances', icon: '📺' },
  ];

  return (
    //
    <div className="container-fluid bg-white shadow-sm py-3 mb-4">
      <div className="d-flex justify-content-center gap-4 flex-wrap">
        {categories.map((item) => (
          <div 
            key={item.id} 
            className="text-center" 
            style={{ cursor: 'pointer', minWidth: '80px' }}
            onClick={() => setSelectedCategory(item.id)}
          >
            <div style={{ fontSize: '2rem' }}>{item.icon}</div>
            <p className="mb-0 small fw-bold text-secondary">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;