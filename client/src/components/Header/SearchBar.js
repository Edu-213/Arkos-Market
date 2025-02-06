import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef, useCallback } from 'react';

const SearchBar = React.forwardRef(({ searchTerm, setSearchTerm, isFocus, setIsFocus, isScrolled }, ref) => {
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);
  const controllerRef = useRef(null);

  const fetchSearchResults = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const response = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(searchTerm)}`, { signal: controllerRef.current.signal });
      const data = await response.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Erro ao buscar produtos:', error);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(fetchSearchResults, 200);

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [searchTerm, fetchSearchResults]);

  const handleSearch = e => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (Array.isArray(searchResults)) {
      const matchingDepartment = searchResults.find(result => result.department && result.department.name.toLowerCase() === searchTerm.trim().toLowerCase());
      const matchingCategory = searchResults.find(result => result.category && result.category.name.toLowerCase() === searchTerm.trim().toLowerCase());
      const matchingSubcategory = searchResults.find(result => result.subcategory && result.subcategory.name.toLowerCase() === searchTerm.trim().toLowerCase());

      if (matchingDepartment) {
        window.location.href = `/${encodeURIComponent(matchingDepartment.department.name)}`;
      } else if (matchingCategory) {
        console.log(matchingCategory);
        window.location.href = `/${encodeURIComponent(matchingCategory.department.name)}/${encodeURIComponent(matchingCategory.category.name)}`;
      } else if (matchingSubcategory) {
        console.log(matchingSubcategory);
        window.location.href = `/${encodeURIComponent(matchingSubcategory.department.name)}/${encodeURIComponent(matchingSubcategory.category.name)}/${encodeURIComponent(matchingSubcategory.subcategory.name)}`;
      } else {
        window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      }
    } else {
      console.error('searchResults não é um array:', searchResults);
    }
  };

  return (
    <div className="flex flex:col md:flex-row p-4 pt-2 md:p-0 md:relative items-center md:w-1/2 justify-center z-40 w-full" ref={ref}>
      <form onSubmit={handleSearch} className="w-full md:flex">
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsFocus(true)}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="busque aqui"
          className={`w-full p-2 md:rounded-lg text-black placeholder-gray-500 focus:outline-none ${isScrolled ? 'pl-4 h-[2.25rem]' : ''}`}
        />
        <button
          type="submit"
          className={`absolute md:right-0 md:block p-2 text-black text-1xl ${
            isScrolled ? 'right-14 top-3 text-sm text-gray-400 md:text-black md:text-base md:p-2 md:right-0 md:top-0' : 'right-5'
          }`}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      {isFocus && searchTerm && (
        <div className={`absolute md:top-[2.8rem] bg-white z-50 w-full ${isScrolled ? 'top-[3.25rem]' : 'top-[6.5rem]'}`}>
          {searchResults.length > 0 ? (
            searchResults.slice(0, 5).map(product => (
              <a key={product._id} href={`/product/${product._id}`} onClick={() => setIsFocus(false)}>
                <div className="flex flex-col p-[0.1875rem] border-b hover:bg-gray-200">
                  <div key={product._id} className="flex items-center w-full">
                    <div className="flex p-[0.1875rem]">
                      <div className="w-[2.8125rem] object-contain object-center">
                        <FontAwesomeIcon icon={faSearch} className="relative top-[0.125rem] mr-[0.5rem] text-[0.875rem] text-gray-700 pl-[0.5rem] md:hidden" />
                        <img src={`http://localhost:5000${product.image}`} alt={product.name} className={`${isScrolled ? 'hidden md:flex' : ' hidden md:flex'}`}></img>
                      </div>
                      <div className="text-[0.875rem] leading-[1.5rem] line-clamp-1 overflow-hidden text-ellipsis pl-[0.5rem] text-gray-700">{product.name}</div>
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="flex flex-col p-[0.1875rem] border-b">
              <div className="text-[0.875rem] leading-[1.5rem] line-clamp-1 overflow-hidden text-ellipsis pl-[0.5rem] text-gray-700">Nenhum produto encontrado</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SearchBar;
