import React, { useState } from 'react';

function UserHome() {
  const [filterType, setFilterType] = useState('');
  const [secondSelect, setSecondSelect] = useState('');
  
  const options = {
    location: ['TPHCM', 'Hà Nội'],
    salary: ['Dưới 10 triệu', '10 triệu đến 15 triệu', 'Trên 15 triệu'],
    industry: ['Công nghệ thông tin', 'Kinh doanh'],
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setSecondSelect(''); // Reset the second select when the first one changes
  };

  const handleSecondSelectChange = (e) => {
    setSecondSelect(e.target.value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ backgroundColor: 'silver', padding: '20px' }}>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search..."
            style={{ padding: '10px', width: '500px', borderWidth: '1px' }}
          />
          <button style={{ padding: '10px', marginLeft: '10px', color: 'blue' }}>
            Search
          </button>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            style={{ padding: '10px', marginRight: '10px' }}
          >
            <option value="">Chọn loại lọc...</option>
            <option value="location">Theo địa điểm</option>
            <option value="salary">Theo mức lương</option>
            <option value="industry">Theo ngành nghề</option>
          </select>

          <select
            value={secondSelect}
            onChange={handleSecondSelectChange}
            style={{ padding: '10px', marginRight: '10px' }}
            disabled={!filterType} // Disable until a filter type is selected
          >
            <option value="">Chọn tùy chọn...</option>
            {filterType === 'location' && options.location.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
            {filterType === 'salary' && options.salary.map((sal, index) => (
              <option key={index} value={sal}>{sal}</option>
            ))}
            {filterType === 'industry' && options.industry.map((ind, index) => (
              <option key={index} value={ind}>{ind}</option>
            ))}
          </select>

          <button style={{ padding: '10px', color: 'blue' }}>
            Lọc
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
