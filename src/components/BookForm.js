import React, { Component } from 'react';
import {
  Form, FormGroup, Label, Input, 
  Button,
  Col} from 'reactstrap';
import axios from 'axios';
import {API} from '../config'


class BookForm extends Component {
  state = {form:{title:"", isbn:"", author:"", stock: "", price: "", 
    published_at:"", synopsis: "", genre: "", image_url:""}, edit: false, success: false}
  
  componentDidMount(){
    if(this.props.book_id){
      this.setState({edit: true})
      axios.get(`${API}/books/${this.props.book_id}`)
      .then(res => {
        let form = res.data.data
        this.setState({form})
      })
    }
  }
  
  handleChange = (e) => {
    this.setState({form:{...this.state.form, [e.target.name]: e.target.value}})
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    let method = "post"
    let book_id = this.props.book_id
    if(this.state.edit){
      method = "put"
      book_id = "/" + this.props.book_id
    }
    
    axios({
      method: method,
      url: `${API}/books${book_id}`,
      data: this.state.form})
      .then(res => {
          if(res.data.status === "success"){
            this.setState({success: true})
            if(!this.state.edit){
            this.setState({form:{title:"", isbn:"", author:"", 
              stock: "", price: "", published_at:"", synopsis: "", 
              genre: "", image_url:""}})
            }
              
            this.props.fetchBooks()  
            setTimeout(()=>this.setState({success: false}, this.props.toggle), 1000)
        }
      })
  }
  
  render(){
    let {title, isbn, author, stock, price, published_at, synopsis, genre, image_url} = this.state.form
    
    return(
        <Col md={{size:"8"}} className="book-form">
          <h6>Add a New Book</h6>
          {this.state.success && 
            <div className="alert alert-success text-center" role="alert">
              Success
            </div>}
          <hr/>
          <Form onSubmit={this.handleSubmit} >
            <FormGroup>
              <div className="form-row">
                <div className="col-md-7 mb-2">
                  <Label for="title">Title</Label>
                  <Input onChange={this.handleChange} type="text" 
                    name="title" 
                    value={title}
                    />
                </div>
                <div className="col-md-5">
                  <Label for="author">Author</Label>
                  <Input onChange={this.handleChange} type="text" name="author" 
                    value={author}
                   />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="form-row">
                <div className="col-md-6">
                  <Label for="isbn">ISBN</Label>
                  <Input onChange={this.handleChange} type="text" name="isbn" 
                    value={isbn}
                    placeholder="978-3-16-148410-0"/>
                </div>
                <div className="col-md-3">
                  <Label for="publishedDate">Published Date</Label>
                  <Input onChange={this.handleChange} type="date" 
                    value={published_at}
                    name="published_at"/>
                </div>
                <div className="col-md-3">
                  <Label for="price">Price</Label>
                  <div className="input-group">  
                    <div className="input-group-prepend">
                      <div className="input-group-text">$</div>
                    </div>
                    <Input onChange={this.handleChange} type="number" name="price" 
                      value={price}
                      placeholder="20.00" className="form-control"/>
                  </div>
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="form-row">
                <div className="col">
                  <Label>Genre</Label>
                  <Input onChange={this.handleChange} type="text" 
                    name="genre"
                    value={genre}
                    placeholder="Action|Romance|Comedy"/>
                </div>
                <div className="col-md-2">
                  <Label for="stock">Stock</Label>
                  <Input onChange={this.handleChange} type="number" name="stock" 
                    value={stock}
                    placeholder="1235" />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="synopsis">Image URL</Label>
              <Input onChange={this.handleChange} type="text" name="image_url" 
                value={image_url}
                placeholder="http://images.com/...jpg"/>
            </FormGroup>
            <FormGroup>
              <Label for="synopsis">Synopsis</Label>
              <Input onChange={this.handleChange} type="textarea" rows="5" name="synopsis" 
                value={synopsis}
                placeholder="Text goes here..."/>
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </Col>
    )
  }
}

export default BookForm
