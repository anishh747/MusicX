import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar/searchBar.css";
import { TbMusicSearch } from "react-icons/tb";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSearchBar = () => {
    setIsSearchBarVisible((prev) => !prev);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search/q/${searchQuery}`);
    setIsSearchBarVisible(false);
  };

  return (
    <>
      <div className="search-bar ">
        <TbMusicSearch className="search-logo" onClick={toggleSearchBar} />
        {isSearchBarVisible && (
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        )}
      </div>
    </>
  );
};

export default SearchBar;
