import React, { Component } from 'react';

const fetchFromServer = body => fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      posts: [],
      authors: [],
    };
  }

  componentDidMount() {
    const query = "{ posts { id title votes author { firstName lastName } } }";
    fetchFromServer({ query }).then(res => res.json()).then(res => {
      this.setState({
        loading: false,
        posts: res.data.posts,
      });
    });
  }

  renderLoader() {
    return <div>loading...</div>;
  }

  upvote(postId) {
    const query = "mutation($postId:ID!) {upvotePost(postId:$postId) { id }}";
    const variables = { postId };
    fetchFromServer({ query, variables }).then(res => res.json()).then(res => {
      const posts = this.state.posts;
      posts.forEach(p => {
        if (p.id === postId) {
          p.votes = res.upvotePost.votes;
        }
      });
      this.setState({ posts });
    });
  }

  renderPost(post) {
    const author = `${post.author.firstName} ${post.author.lastName}`;
    return <li key={post.id}>
      <span>"{post.title}" submitted by {author}</span>
      <br />
      <span>upvotes: {post.votes}</span>
      <br />
      <span><a href="#" onClick={() => this.upvote(post.id)}>upvote</a></span>
    </li>;
  }

  renderPosts() {
    return <ul>{this.state.posts.map(this.renderPost)}</ul>;
  }

  render() {
    return this.state.loading ? this.renderLoader() : this.renderPosts();
  }
}

export default App;
