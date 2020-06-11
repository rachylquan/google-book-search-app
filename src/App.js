import React, { Component } from 'react';
import Header from './Header/Header'
import SearchForm from './SearchForm/SearchForm'
import BookList from './BookList/BookList'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookResults: [],
      searchTerm: "",
      printType: "all",
      bookType: "no-filter"
    };
  }

  setPrintTypeSelection(sel) {
    console.log("Print type selected is: ", sel);
    this.setState({
      printType: sel
    });
  }

  setBookTypeSelection(sel) {
    console.log("Book type selected is: ", sel);
    this.setState({
      bookType: sel
    });
  }

  changeSearchTerm(inp) {
    console.log("Search has been activated. Search entry is: ", inp);
    this.setState({
      searchTerm: inp
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('form submitted');

    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    const key = 'AIzaSyBM8gN8ltXClQCQzDvDTfWZkO2X07c-MKw';

    const url = this.formatQuery(baseUrl, key);
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong, please try again later.')
      }
      return response.json();
    })
    .then(data => {
      this.setState({
        bookResults: data.items,
        error: null
      })
    })
    .catch(err => {
      this.setState({
        error: err.message
      })
    })
  }

  formatQuery(baseUrl, key) {
    const {searchTerm, printType, bookType} = this.state;
    let query;
    if (searchTerm !== "") {
      query = '?q=' + searchTerm;
    }
    if (printType !== "all") {
      query = query + '&bookType' + printType;
    }
    if (bookType !== "no-filter") {
      query = query + '&filter' + bookType;
    }
    const url = baseUrl + query + '&key=' + key;
    return url;
  }

  render() {
    const selectOptions = {
      printType: ["all", "books", "magazines"],
      bookType: ["no-filter", "partial", "full", "free-ebooks", "paid-ebooks", "ebooks"]
    };

    const bookResults = this.state;

    return (
      <div className="App">
        <Header />
        <SearchForm 
         selectOptions={selectOptions}
         handleSubmit={e => this.handleSubmit(e)}
         handleChangeSearchTerm={inp => this.changeSearchTerm(inp)}
         handlePrintTypeSel={sel => this.setPrintTypeSelection(sel)}
         handleBookTypeSel={sel => this.setBookTypeSelection(sel)}
        />
        <BookList bookResults={ bookResults }/>
      </div>
    );
  }
}

export default App;
