import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/filter_reducer'
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'
import { useProductsContext } from './products_context'

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: 'price-lowest',
  //Filters default value
  filters: {
    // text need to match exactly in the input name='text'
    text: '',
    company: 'all',
    category: 'all',
    color: 'all',
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  }
}

const FilterContext = React.createContext()
console.log(FilterContext);

export const FilterProvider = ({ children }) => {
  // Fetch products
  const {products} = useProductsContext()
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(useReducer(reducer, initialState));
  useEffect(() => {
    // We dispatch with the type LOAD_PRODUCTS, and all product in the payload
    dispatch({type: LOAD_PRODUCTS, payload: products})
    // don't forget to put product in the array for the useEffect
  }, [products])

  useEffect(() => {
    dispatch({type: FILTER_PRODUCTS})
    dispatch({type: SORT_PRODUCTS})
  }, [products, state.sort, state.filters])

  const setGridView = () => {
    dispatch({type: SET_GRIDVIEW})
  }

  const setListView = () => {
    dispatch({type: SET_LISTVIEW})
  }

  const updateSort = (e) => {
    // For demonstration
    // const name = e.target.name
    const value = e.target.value
    console.log('value',value);
    dispatch({type: UPDATE_SORT, payload: value})
  }

  
  const updateFilters = (e) => {
    let name = e.target.name
    let value = e.target.value
    console.log("VALUE", value);
    console.log("Name", name);

    if(name === 'category') {
      value = e.target.textContent
    }

    if(name === 'color') {
      value = e.target.dataset.color
    }

    if(name === 'price') {
      value = Number(value)
    }

    if(name === 'shipping') {
      value = e.target.checked
    }

    dispatch({type: UPDATE_FILTERS, payload: { name, value }})

  }
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  return (
    <FilterContext.Provider value={{...state, setGridView, setListView, updateSort, updateFilters, clearFilters}}>
      {children}
    </FilterContext.Provider>
  )
}
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext)
}
