import React, { useEffect, useState } from 'react';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCountries = filteredCountries.sort((a, b) => {
    const nameA = a.name.official.toLowerCase();
    const nameB = b.name.official.toLowerCase();

    if (sortOrder === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  const pageSize = 25;
  const totalPages = Math.ceil(sortedCountries.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedCountries = sortedCountries.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Country Catalog</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="search" className="mr-2">
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 p-2 rounded-lg"
          placeholder="Search by Country Name"
        />
      </div>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 border-b border-gray-300">Flag</th>
            <th className="p-2 border-b border-gray-300 cursor-pointer" onClick={handleSort}>
              Country Name {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th className="p-2 border-b border-gray-300">2 character Country Code</th>
            <th className="p-2 border-b border-gray-300">3 character Country Code</th>
            <th className="p-2 border-b border-gray-300">Native Country Name</th>
            <th className="p-2 border-b border-gray-300">Alternative Country Name</th>
            <th className="p-2 border-b border-gray-300">Country Calling Codes</th>
          </tr>
        </thead>
        <tbody>
          {displayedCountries.map((country) => (
            <tr >
              <td key={country.cca3} className="p-2 border-b border-gray-300">
                <img src={country.flags.png} alt="Flag" className="w-8 h-auto" />
              </td>
              <td className="p-2 border-b border-gray-300 cursor-pointer" onClick={() => handleCountryClick(country)}>
                {country.name.official}
              </td>
              <td className="p-2 border-b border-gray-300">{country.cca2}</td>
              <td className="p-2 border-b border-gray-300">{country.cca3}</td>

              <td className="p-2 border-b border-gray-300">
                
                {country.name.nativeName?.fra?.common ? country.name.nativeName.fra.common : "NF"}
              
              
              </td>

              {/* <td className="p-2 border-b border-gray-300">{country["name"]["nativeName"]["fra"]["common"]}</td> */}
              <td className="p-2 border-b border-gray-300">{country.altSpellings.join(', ')}</td>
              <td className="p-2 border-b border-gray-300">{country.idd.root},</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`mx-2 px-4 py-2 rounded-lg ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{selectedCountry.name.official}</h2>
            <p>Capital: {selectedCountry.capital}</p>
            <p>Population: {selectedCountry.population}</p>
            <p>Region: {selectedCountry.region}</p>
            <p>Subregion: {selectedCountry.subregion}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;