import React, { Component } from 'react';

import Table from 'react-bootstrap/lib/Table'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Form from 'react-bootstrap/lib/Form'

import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      initialPosts: [],
      updatedPosts: [],
      selectedPost: {},
      query: ''
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
  }

  async componentDidMount() {
    try {
      setInterval(async () => {
        const res = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story');
        const res_json = await res.json();
        const initialPosts = res_json.hits;

        this.setState({
          initialPosts,
          updatedPosts: initialPosts
        })
      }, 10000);
    } catch(e) {
      console.log(e);
    }
  }

  handleClose = () => {
    this.setState({ 
      showModal: false,
      selectedPost: {}
    });
  }

  handleShow = (post) => {
    this.setState({ 
      showModal: true ,
      selectedPost: post
    });
  }

  handleChangeTitle = (e) => {
    let query = e.target.value;
    this.setState({ query });
    this.doFilter(query)
  }

  doFilter = (query) => {
    let updatedPosts = this.state.initialPosts.filter((post) => {
      return post.title.includes(query)
    });
    this.setState({ updatedPosts })
  }

  render() {
    const { 
      updatedPosts, 
      showModal,
      selectedPost,
      query
    } = this.state; 

    return (
      <div className="App">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control 
            type="text" placeholder="Enter title" 
            onChange={this.handleChangeTitle}
            value={query}
          />
          <Form.Text className="text-muted">
            Start typing "title" for the post you are looking for.
          </Form.Text>
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th>Created ad</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            { updatedPosts.map(post => (
                <tr key={post.objectID} onClick={this.handleShow.bind(this, post)}>
                  <td>{post.title}</td>
                  <td>{post.url}</td>
                  <td>{post.created_at}</td>
                  <td>{post.author}</td>
                </tr>  
              ))
            }
          </tbody>
        </Table>

        <Modal  show={ showModal && !_.isEmpty(selectedPost)} 
                onHide={this.handleClose} 
                backdrop="static"
                size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedPost.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre>{JSON.stringify(selectedPost, null, 2) }</pre>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;
