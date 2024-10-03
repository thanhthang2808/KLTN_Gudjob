import React, { useState } from 'react';

function UserSearch() {
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
      <div style={{ backgroundColor: '#76ee00', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          style={{ padding: '10px', width: '300px', borderWidth: '1px' }}
        />
        
        {/* Search Button */}
        <button style={{ padding: '10px', marginLeft: '10px',color:'white',backgroundColor:'green'}}>
          Search
        </button>

        {/* Separator */}
        <span style={{ margin: '0 10px', fontWeight: 'bold' }}>|</span>

        {/* First Select for Filter Type */}
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

        {/* Second Select for Filter Options */}
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

        {/* Filter Button */}
        <button style={{ padding: '10px', color:'white',backgroundColor:'green' }}>
          Lọc
        </button>

      </div>
    </div>
  );
}

export default UserSearch;
