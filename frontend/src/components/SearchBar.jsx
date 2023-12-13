import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar/searchBar.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="search-bar">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/search/q/${searchQuery}`);
          }}
          className="search-form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </>
  );
};

export default SearchBar;
