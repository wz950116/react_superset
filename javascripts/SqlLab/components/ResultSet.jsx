import React from 'react';
import { Alert, Button, ButtonGroup, ProgressBar } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import shortid from 'shortid';

import VisualizeModal from './VisualizeModal';
import HighlightedSql from './HighlightedSql';
import FilterableTable from '../../components/FilterableTable/FilterableTable';

const propTypes = {
  actions: React.PropTypes.object,
  csv: React.PropTypes.bool,
  query: React.PropTypes.object,
  search: React.PropTypes.bool,
  showSql: React.PropTypes.bool,
  visualize: React.PropTypes.bool,
  cache: React.PropTypes.bool,
  height: React.PropTypes.number.isRequired,
};
const defaultProps = {
  search: true,
  visualize: true,
  showSql: false,
  csv: true,
  actions: {},
  cache: false,
};

const RESULT_SET_CONTROLS_HEIGHT = 146;

export default class ResultSet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      showModal: false,
      data: [],
      height: props.search ? props.height - RESULT_SET_CONTROLS_HEIGHT : props.height,
      offset: 0,
    };
    this.handlePageClick = function (data): void {
      const page = data.selected + 1;
      if (this.parent.props.query) {
        this.parent.props.query.page = page;
        this.parent.setState({
          offset: page - 1,
        });
        this.parent.fetchResults(this.parent.props.query);
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    // when new results comes in, save them locally and clear in store
    if (this.props.cache && (!nextProps.query.cached)
      && nextProps.query.results
      && nextProps.query.results.data.length > 0) {
      this.setState(
        {
          data: nextProps.query.results.data,
        },
        this.clearQueryResults(nextProps.query),
      );
    }
    if (nextProps.query.resultsKey
      && (nextProps.query.id !== this.props.query.id ||
      nextProps.query.resultsKey !== this.props.query.resultsKey)) {
      this.fetchResults(nextProps.query);
    }
  }

  getControls() {
    if (this.props.search || this.props.visualize || this.props.csv) {
      let csvButton;
      if (this.props.csv) {
        csvButton = (
          <Button bsSize="small" href={'/superset/csv/' + this.props.query.id} >
            <i className="fa fa-file-text-o" /> .CSV
          </Button>
        );
      }
      let visualizeButton;
      if (this.props.visualize) {
        visualizeButton = (
          <Button bsSize="small" onClick={this.showModal.bind(this)} >
            <i className="fa fa-line-chart m-l-1" /> Visualize
          </Button>
        );
      }
      let searchBox;
      if (this.props.search) {
        searchBox = (
          <input
            type="text"
            onChange={this.changeSearch.bind(this)}
            className="form-control input-sm"
            placeholder="Search Results"
          />
        );
      }
      return (
        <div className="ResultSetControls" >
          <div className="clearfix" >
            <div className="pull-left" >
              <ButtonGroup>
                {visualizeButton}
                {csvButton}
              </ButtonGroup>
            </div>
            <div className="pull-right" >
              {searchBox}
            </div>
          </div>
        </div>
      );
    }
    return <div className="noControls" />;
  }

  clearQueryResults(query) {
    this.props.actions.clearQueryResults(query);
  }

  popSelectStar() {
    const qe = {
      id: shortid.generate(),
      title: this.props.query.tempTable,
      autorun: false,
      dbId: this.props.query.dbId,
      sql: `SELECT * FROM ${this.props.query.tempTable}`,
    };
    this.props.actions.addQueryEditor(qe);
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }

  hideModal() {
    this.setState({
      showModal: false,
    });
  }

  changeSearch(event) {
    this.setState({
      searchText: event.target.value,
    });
  }

  fetchResults(query) {
    this.props.actions.fetchQueryResults(query);
  }

  reFetchQueryResults(query) {
    this.props.actions.reFetchQueryResults(query);
  }

  render() {
    const query = this.props.query;
    const results = query.results;
    let data;
    if (this.props.cache && query.cached) {
      data = this.state.data;
    } else {
      data = results ? results.data : [];
    }

    let sql;

    if (query.state === 'stopped') {
      return <Alert bsStyle="warning" > Query was stopped </Alert>;
    }

    if (this.props.showSql) {
      sql = <HighlightedSql sql={query.sql} />;
    }
    if (['running', 'pending', 'fetching'].indexOf(query.state) > -1) {
      let progressBar;
      if (query.progress > 0 && query.state === 'running') {
        progressBar = (
          <ProgressBar
            striped
            now={query.progress}
            label={`${query.progress}%`}
          />);
      }
      return (
        <div>
          <img
            className="loading"
            alt="Loading..."
            src="/static/assets/images/loading.gif"
          />
          {progressBar}
        </div>
      );
    } else if (query.state === 'failed') {
      return (<Alert bsStyle="danger" >
      读取数据出错，请尝试重新查询，如果没有解决问题，再尝试F5刷新页面。错误信息： {query.errorMessage} </Alert>);
    } else if (query.state === 'success' && query.ctas) {
      return (
        <div>
          <Alert bsStyle="info" >
            Table [<strong>{query.tempTable}</strong>] was created
            <Button
              bsSize="small"
              className="m-r-5"
              onClick={this.popSelectStar.bind(this)}
            >
              Query in a new tab
            </Button>
          </Alert>
        </div>);
    } else if (query.state === 'success') {
      if (results && data && data.length > 0) {
        return (
          <div>
            <VisualizeModal
              show={this.state.showModal}
              query={this.props.query}
              onHide={this.hideModal.bind(this)}
            />
            {this.getControls.bind(this)()}
            {sql}
            {results.max_page ? <ReactPaginate
              previousLabel={'上一页'}
              nextLabel={'下一页'}
              breakLabel={<a href="" >...</a>}
              breakClassName={'break-me'}
              pageCount={results.max_page}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
              parent={this}
              forcePage={this.state.offset}
            /> : ''}
            <FilterableTable
              data={data}
              orderedColumnKeys={results.columns.map(col => col.name)}
              height={this.state.height}
              filterText={this.state.searchText}
            />
          </div>
        );
      }
    }
    if (query.cached) {
      return (
        <Button
          bsSize="sm"
          bsStyle="primary"
          onClick={this.reFetchQueryResults.bind(this, query)}
        >
          Fetch data preview
        </Button>
      );
    }
    return (<Alert bsStyle="warning" >
             The query returned no data
    </Alert>);
  }
}
ResultSet.propTypes = propTypes;
ResultSet.defaultProps = defaultProps;
