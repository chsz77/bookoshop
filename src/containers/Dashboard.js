import React, {Component} from 'react'
import { Col, Row,
  Container, Table } from 'reactstrap';
import axios from 'axios';
import {API} from '../config'
import {Link} from 'react-router-dom'
import ReviewForm from '../components/ReviewForm'
import BookForm from '../components/BookForm'
import Spinner from '../components/Spinner'



class Dashboard extends Component {
    state = {transactions:[], transItems: [], reviews:[], 
        book_id: "", review_id: "", review_form: false,
        books:[],
        orders: [],
        adminSection: "orders",
        modal:false, loading: false, activeSection: "Transactions", spinner: false}
    
    componentDidMount(){
        this.fetchTransactions()
        this.fetchReviews()
        this.fetchBooks()
        this.fetchOrders()
    }
    
    fetchTransactions = () => {
        let user_id = this.props.currentUser.user_id
        axios.get(`${API}/users/${user_id}/transactions`)
            .then(res => {
                let transactions = res.data.data
                this.setState({transactions})
            })
    }
    
    fetchTransItems = (pay_id) => {
        this.setState({modal: true, loading: true})
        let user_id = this.props.currentUser.user_id
        axios.get(`${API}/users/${user_id}/transactions/${pay_id}`)
            .then(res => {
                let transItems = res.data.data
                this.setState({transItems, loading: false})
            })
    }
    
    fetchReviews = () => {
        let user_id = this.props.currentUser.user_id
        axios.get(`${API}/reviews/users/${user_id}`)
            .then(res => {
                let reviews = res.data.data
                this.setState({reviews})
            })
    }
    
    toggleForm = e => {
        this.setState({showForm: !this.state.showForm})
      }
    
    
    deleteReview = (review_id) => {
        axios.delete(`${API}/reviews/${review_id}`)
            .then(res => {
                this.setState({reviews:this.state.reviews.filter(review => review.review_id !== review_id)})
            })
    }
    
    fetchBooks = (sort="created_at") => {
        this.setState({spinner: true})
        axios.get(`${API}/books?type=${sort}`)
          .then(res => {
            let books = res.data.data
            if(this.state.books.length > 0 && this.state.books[0].book_id === books[0].book_id){
                books = books.reverse()
                console.log("triggered")
            }
            this.setState({books, spinner: false})
          })
    }
    
    showBookForm = () => {
        this.setState({bookForm: !this.state.bookForm})
        if(!this.state.bookForm){
            this.setState({book_id: ""})
        }
    }
    
    deleteBook = (book_id) => {
        axios.delete(`${API}/books/${book_id}`)
            .then(res => {
                this.setState({books:this.state.books.filter(book => book.book_id !== book_id), book_id: ""})
            })
    }
    
    fetchOrders = () => {
        
        axios.get(`${API}/users/admin/transactions`)
            .then(res => {
                let orders = res.data.data
                this.setState({orders})
            })
    } 
    
    render(){
        const transactions = this.state.transactions.map((trans, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td 
                    style={{cursor: "pointer", color: "#007bff"}}
                    onClick={this.fetchTransItems.bind(this, trans.pay_id)}>{trans.pay_id}</td>
                <td>${trans.ship_cost}</td>
                <td>${trans.cart_total}</td>
                <td>{trans.ship_address}</td>
                <td>{trans.created_at}</td>
            </tr>
        ))
        
        const transItems = this.state.transItems.map((item, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td><img style={{height: "100px", width: "75px"}}src={item.image_url} alt={item.title}/></td>
                <td>{item.title}</td>
                <td>{"$" + item.price}</td>
            </tr>
        ))
        
        const transItemsList = this.state.modal && !this.state.loading &&
                    <div className="trans-info">
                    <span onClick={()=>this.setState({modal: false})}>&times;</span>
                    <Table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                            {transItems}
                        </tbody>
                    </Table>
                    </div>
                
        
        const tranSection = this.state.activeSection === "Transactions" && 
                        <Col>
                            <h6>Your Transactions</h6>
                            <hr/>
                            <Table bordered>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Pay ID</th>
                                    <th>Shipping</th>
                                    <th>Total</th>
                                    <th>Address</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                    {transactions}
                                </tbody>
                            </Table>
                        </Col>
        
        const reviews = this.state.reviews.map((review, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td><img style={{height: "100px", width: "75px"}}src={review.image_url} alt={review.title}/></td>
                <td>{review.text.length > 100 ? (review.text.substring(0,100)+"...") : review.text}</td>
                <td>{Number(review.rating)/10}</td>
                <td><Link to={`/books/${review.book_id}`}>{review.title}</Link></td>
                <td>{review.created_at}</td>
                <td>
                    <span 
                    style={{cursor: "pointer", color: "red"}}
                    onClick={this.deleteReview.bind(this, review.review_id)}>
                    Delete
                    </span>
                    <hr/>
                    <span  
                    style={{cursor: "pointer", color: "#007bff"}}
                    onClick={()=>this.setState({book_id: review.book_id, 
                    showForm: true,
                    review_id: review.review_id})}>Edit</span>
                </td>
            </tr>    
        ))
        
        const revSection = this.state.activeSection === "Reviews" &&
                        <Col> 
                            <h6>Reviews</h6>
                            <hr/>
                            <Table>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Cover</th>
                                    <th>Reviews</th>
                                    <th>Rating</th>
                                    <th>Book</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                    {reviews}
                                </tbody>
                            </Table>
                        </Col>
        
        
        const books = this.state.books.map((book, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td><img style={{height: "100px", width: "75px"}}src={book.image_url} alt={book.title}/></td>
                <td><Link to={`/books/${book.book_id}`}>{book.title}</Link></td>
                <td>{"$" + book.price}</td>
                <td>{book.stock}</td>
                <td>{book.sold}</td>
                <td>{book.views}</td>
                <td>{(Number(book.rating)/10).toFixed(2)}</td>
                <td>{book.author}</td>
                <td>{book.genre.replace(/[|]/g, ", ")}</td>
                <td>{book.published_at}</td>
                <td>
                    <span
                    onClick={this.deleteBook.bind(this, book.book_id)}
                    style={{cursor: "pointer", color: "red"}}>
                    Delete
                    </span>
                    <hr/>
                    <span
                    onClick={()=>this.setState({book_id: book.book_id, 
                    bookForm: true})}
                    style={{cursor: "pointer", color: "#007bff"}}
                    >Edit</span>
                </td>
                <td>{book.created_at}</td>
            </tr>
        ))            
        
        let bookSection = this.state.adminSection === "books" &&
            <div>
                <h6>Book
                    <span>{" (" + this.state.books.length + ")"}</span>
                    <span
                    style={{fontSize: "20px" , cursor: "pointer"}}
                    onClick={this.showBookForm}
                    className="float-right">[+]</span>
                </h6>
                <hr/>
                <div>
                <Table >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cover</th>
                        <th onClick={()=>this.fetchBooks("title")} style={{cursor: "pointer", color: "#007bff"}}>Title</th>
                        <th onClick={()=>this.fetchBooks("price")} style={{cursor: "pointer", color: "#007bff"}}>Price</th>
                        <th onClick={()=>this.fetchBooks("price")} style={{cursor: "pointer", color: "#007bff"}}>Stock</th>
                        <th onClick={()=>this.fetchBooks("sold")} style={{cursor: "pointer", color: "#007bff"}}>Sold</th>
                        <th onClick={()=>this.fetchBooks("views")} style={{cursor: "pointer", color: "#007bff"}}>Views</th>
                        <th onClick={()=>this.fetchBooks("rating")} style={{cursor: "pointer", color: "#007bff"}}>Rating</th>
                        <th onClick={()=>this.fetchBooks("author")}>Author</th>
                        <th onClick={()=>this.fetchBooks("genre")} style={{cursor: "pointer", color: "#007bff"}}>Genre</th>
                        <th>Published</th>
                        <th>Actions</th>
                        <th onClick={()=>this.fetchBooks("created_at")} style={{cursor: "pointer", color: "#007bff"}}>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                        {books}
                    </tbody>
                </Table>
                </div>
            </div>
        
        
        let orders = this.state.orders.map((order, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td 
                    style={{cursor: "pointer", color: "#007bff"}}
                    onClick={this.fetchTransItems.bind(this, order.pay_id)}>{order.pay_id}</td>
                <td>Not delivered</td>
                <td>{order.username}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.email}</td>
                <td>${order.ship_cost}</td>
                <td>${order.cart_total}</td>
                <td>{order.ship_address}</td>
                <td>{order.created_at}</td>
            </tr>
        ))
        
        let orderSection = this.state.adminSection === "orders" &&
            <div>
                <h6>Orders <span>{"(" + this.state.orders.length + ")"}</span></h6>
                <hr/>
                <Table bordered>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Pay ID</th>
                        <th>Status</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Shipping</th>
                        <th>Total</th>
                        <th>Address</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                        {orders}
                    </tbody>
                </Table>
            </div>
        
        
        let adminSection = this.state.activeSection === "Admin" &&
            <Col md="10" className="admin-section"> 
                {orderSection}
                {bookSection}
            </Col>                
        
        
        let sections = ["Transactions", "Reviews", "Profile", "Admin"]
        
        let sectionsList = sections.map(section => (
          <li key={section} onClick={()=>this.setState({activeSection: section})} 
          className={section.toUpperCase() === this.state.activeSection.toUpperCase() ? 
          "sort-active genres-list" : "genres-list"}>
          {section}</li>
        ))
        
        if(!this.props.currentUser.user_id){
          this.props.history.push("/books")
        }
        
        return (
            <Container className="dashboard">
                <Row>
                    {this.state.spinner &&
                    <Spinner />}
                    <Col md="2">
                        <ul style={{fontSize: "0.9rem", marginTop: "30px", 
                            paddingRight: "30px",
                            borderRight: "solid 1px lightgrey"}}>
                        <p><strong>Section</strong></p>
                            {sectionsList}
                            {this.state.activeSection === "Admin" && 
                            <ul>
                                <hr/>
                                <li 
                                style={{cursor: "pointer", color: "#007bff"}}
                                onClick={()=>this.setState({adminSection: "orders"})}>Orders</li>
                                <br/>
                                <li 
                                style={{cursor: "pointer", color: "#007bff"}}
                                onClick={()=>this.setState({adminSection: "books"})}>Books</li>
                              </ul>
                            }
                        </ul>
                    </Col>
                        {tranSection}
                        {revSection}
                        {adminSection}
                </Row>
                {transItemsList}
                
                {this.state.showForm &&
                <ReviewForm edit 
                    userId={this.props.currentUser.user_id} review_id={this.state.review_id}
                    toggle={this.toggleForm.bind(this)}
                    book_id={this.state.book_id}
                    fetchReviews={this.fetchReviews.bind(this)}
                    />
                }
                {this.state.bookForm && 
                <div className="book-form-parent">
                <span onClick={this.showBookForm}>&times;</span>
                <BookForm
                    book_id={this.state.book_id}
                    toggle={this.showBookForm.bind(this)} fetchBooks={this.fetchBooks.bind(this)}/>
                </div>
                }
            </Container>
        )
    }
}

export default Dashboard