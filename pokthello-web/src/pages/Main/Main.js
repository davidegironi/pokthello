// Copyright (c) 2020 Davide Gironi
// Please refer to LICENSE file for licensing information.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';

// load style
import s from './Main.module.css';

export default function Main() {
  // states
  const [searchname, setSearchname] = useState('');
  const [error, setError] = useState(null);
  const [founditem, setFounditem] = useState(null);
  const [issearching, setIssearching] = useState(false);
  const [favorites, setFavorites] = useState([]);

  /**
   * add item to favorites
   * @param {object} item
   */
  function addFavorites(item) {
    if (!favorites.find((r) => r.name === item.name)) {
      const favoritesnew = [
        ...favorites,
        item,
      ];
      setFavorites(favoritesnew);
      localStorage.setItem('favorites', JSON.stringify(favoritesnew));
    }
  }

  /**
   * remove item to favorites
   * @param {string} name
   */
  function removeFavorites(name) {
    const favoritesnew = favorites.filter((r) => r.name !== name);
    setFavorites(favoritesnew);
    localStorage.setItem('favorites', JSON.stringify(favoritesnew));
  }

  /**
   * get favorites
   */
  function getFavorites() {
    const favoritesstorage = localStorage.getItem('favorites');
    if (favoritesstorage) setFavorites(JSON.parse(favoritesstorage));
  }

  // effects - reset on search changed
  useEffect(() => {
    setError(null);
    if (!searchname) setFounditem(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    else if (founditem) setFounditem(null);
  }, [searchname]);

  // effects - load favorites
  useEffect(() => {
    getFavorites();
  }, []);

  /**
   * search a pokemon by name
   * @param {string} name
   */
  async function search(name) {
    // validate
    if (!name) {
      setError(null);
      return;
    }
    // search local storage
    const localeitem = favorites.find((r) => r.name === name);
    if (localeitem) {
      setFounditem(localeitem);
      return;
    }
    // search online
    setIssearching(true);
    setFounditem(null);
    setError(null);
    try {
      const searchurl = `${process.env.REACT_APP_APIURL}${name}`;
      const response = await axios.get(searchurl);
      if (response && response.status === 200 && response.data
        && response.data.name && response.data.description) {
        setFounditem({
          name: response.data.name,
          description: response.data.description,
        });
      } else setError('Error fetching data');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else setError(err.message);
    }
    setIssearching(false);
  }

  return (
    <div>
      <div className={s.contentfavorites}>
        {favorites && favorites.length > 0
          ? (
            <div className={s.favoritesitemcontainer}>
              {favorites.map((item) => (
                <div
                  key={item.name}
                  className={s.favoritesitem}
                >
                  <button
                    type="button"
                    className={classNames(s.buttonround, s.favoritesitembutton)}
                    disabled={issearching}
                    onClick={() => {
                      search(item.name);
                    }}
                  >
                    {item.name.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          )
          : null }
      </div>
      <div className={s.content}>
        <div className={s.inputcontentainer}>
          <input
            type="text"
            className={s.input}
            placeholder="Search your pokemon"
            value={searchname}
            disabled={issearching}
            onChange={(e) => setSearchname(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={classNames(s.buttonround, s.searchbutton)}
          disabled={issearching}
          onClick={() => {
            search(searchname.toLowerCase());
          }}
        >
          {issearching ? 'Searching...' : 'Search'}
        </button>
        {error
          ? <div className={s.error}>{error}</div>
          : null}
        {founditem
          ? (
            <div className={s.searchresult}>
              <div className={s.searchresulttitle}>{founditem.name.toUpperCase()}</div>
              {founditem.description}
              {favorites.find((r) => r.name === founditem.name)
                ? (
                  <div className={s.buttonfavoritesremovecontainer}>
                    <button
                      type="button"
                      className={classNames(s.buttonround, s.favoritesremovebutton)}
                      onClick={() => {
                        removeFavorites(founditem.name.toLowerCase());
                        setSearchname('');
                        setFounditem(null);
                      }}
                      disabled={issearching}
                    >
                      Remove From Favorites
                    </button>
                  </div>
                )
                : (
                  <div className={s.buttonfavoritesaddcontainer}>
                    <button
                      className={classNames(s.buttonround, s.favoritesaddbutton)}
                      type="button"
                      onClick={() => {
                        addFavorites({
                          name: founditem.name.toLowerCase(),
                          description: founditem.description,
                        });
                        setSearchname('');
                        setFounditem(null);
                      }}
                      disabled={issearching}
                    >
                      Add To Favorites
                    </button>
                  </div>
                )}
            </div>
          )
          : null}
      </div>
    </div>
  );
}
