import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import document from 'global/document';

import MarkdownPage from './markdown-page';
import {loadContent} from '../actions/app-actions';
import * as Demos from './demos';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: this._loadContent(props.route.content),
      fullscreenDemo: false
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', this._onKeyPress);
  }

  componentWillReceiveProps(nextProps) {
    const {route} = nextProps;
    if (this.props.route !== route) {
      this.setState({
        content: this._loadContent(route.content)
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this._onKeyPress);
  }

  @autobind _onKeyPress(event) {
    // 192 is tilda ~ key
    if (event.keyCode === 192) {
      this.setState({fullscreenDemo: !this.state.fullscreenDemo});
    }
  }

  _loadContent(content) {
    if (typeof content === 'string') {
      this.props.loadContent(content);
    }
    return content;
  }

  @autobind _renderDemo(name, isInline) {
    const DemoComponent = Demos[name];
    let className = 'inline-code';
    if (!isInline) {
      className = this.state.fullscreenDemo ?
        'demo fullscreen' :
        'demo';
    }
    return (<div className={className}>
        <DemoComponent />
      </div>
    );
  }

  // replaces the current query string in react-router
  @autobind _updateQueryString(queryString) {
    const {location: {pathname, search}} = this.props;
    if (search !== queryString) {
      this.context.router.replace({
        pathname,
        search: queryString
      });
    }
  }

  render() {
    const {contents, location: {query}} = this.props;
    const {content} = this.state;

    let child;

    if (content.demo) {
      child = this._renderDemo(content.demo, content.code);
    } else if (typeof content === 'string') {
      child = (<MarkdownPage content={contents[content]}
        query={query}
        updateQueryString={this._updateQueryString}
        renderDemo={this._renderDemo} />);
    }

    return <div className="page">{child}</div>;
  }
}

Page.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state) {
  return {
    contents: state.contents
  };
}

export default connect(mapStateToProps, {loadContent})(Page);
