import React from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';

import TableElement from './TableElement';
import AsyncSelect from '../../components/AsyncSelect';

const $ = window.$ = require('jquery');

const propTypes = {
  queryEditor: React.PropTypes.object.isRequired,
  height: React.PropTypes.number.isRequired,
  tables: React.PropTypes.array,
  actions: React.PropTypes.object,
};

const defaultProps = {
  tables: [],
  actions: {},
};

class SqlEditorLeftBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      schemaLoading: false,
      schemaOptions: [],
      tableLoading: false,
      tableOptions: [],
    };
  }
  componentWillMount() {
    this.fetchSchemas(this.props.queryEditor.dbId);
    this.fetchTables(this.props.queryEditor.dbId, this.props.queryEditor.schema);
  }
  onChange(db) {
    const val = db ? db.value : null;
    this.setState({ schemaOptions: [] });
    this.props.actions.queryEditorSetSchema(this.props.queryEditor, null);
    this.props.actions.queryEditorSetDb(this.props.queryEditor, val);
    if (!(db)) {
      this.setState({ tableOptions: [] });
    } else {
      this.fetchTables(val, this.props.queryEditor.schema);
      this.fetchSchemas(val);
    }
  }
  getTableNamesBySubStr(input) {
    if (!this.props.queryEditor.dbId || !input) {
      return Promise.resolve({ options: [] });
    }
    const url = `/superset/tables/${this.props.queryEditor.dbId}/` +
                `${this.props.queryEditor.schema}/${input}`;
    return $.get(url).then(data => ({ options: data.options }));
  }
  dbMutator(data) {
    const options = data.result.map(db => ({ value: db.id, label: db.database_name }));
    this.props.actions.setDatabases(data.result);
    if (data.result.length === 0) {
      this.props.actions.addAlert({
        bsStyle: 'danger',
        msg: "It seems you don't have access to any database",
      });
    }
    return options;
  }
  resetState() {
    this.props.actions.resetState();
  }
  fetchTables(dbId, schema, substr) {
    // This can be large so it shouldn't be put in the Redux store
    if (dbId && schema) {
      this.setState({ tableLoading: true, tableOptions: [] });
      const url = `/superset/tables/${dbId}/${schema}/${substr}/`;
      $.get(url, (data) => {
        const filterOptions = createFilterOptions({ options: data.options });
        this.setState({
          filterOptions,
          tableLoading: false,
          tableOptions: data.options,
          tableLength: data.tableLength,
        });
      });
    } else {
      this.setState({ tableLoading: false, tableOptions: [], filterOptions: null });
    }
  }
  changeTable(tableOpt) {
    if (!tableOpt) {
      this.setState({ tableName: '' });
      return;
    }
    const namePieces = tableOpt.value.split('.');
    let tableName = namePieces[0];
    let schemaName = this.props.queryEditor.schema;
    if (namePieces.length === 1) {
      this.setState({ tableName });
    } else {
      schemaName = namePieces[0];
      tableName = namePieces[1];
      this.setState({ tableName });
      this.props.actions.queryEditorSetSchema(this.props.queryEditor, schemaName);
      this.fetchTables(this.props.queryEditor.dbId, schemaName);
    }
    this.setState({ tableLoading: true });
    // TODO: handle setting the tableLoading state depending on success or
    //       failure of the addTable async call in the action.
    this.props.actions.addTable(this.props.queryEditor, tableName, schemaName);
    this.setState({ tableLoading: false });
  }
  changeSchema(schemaOpt) {
    const schema = (schemaOpt) ? schemaOpt.value : null;
    this.props.actions.queryEditorSetSchema(this.props.queryEditor, schema);
    this.fetchTables(this.props.queryEditor.dbId, schema);
  }
  fetchSchemas(dbId) {
    const actualDbId = dbId || this.props.queryEditor.dbId;
    if (actualDbId) {
      this.setState({ schemaLoading: true });
      const url = `/superset/schemas/${actualDbId}/`;
      $.get(url, (data) => {
        const schemaOptions = data.schemas.map(s => ({ value: s, label: s }));
        this.setState({ schemaOptions });
        this.setState({ schemaLoading: false });
      });
    }
  }
  closePopover(ref) {
    this.refs[ref].hide();
  }

  render() {
    const shouldShowReset = window.location.search === '?reset=1';
    const tableMetaDataHeight = this.props.height - 130; // 130 is the height of the selects above
    return (
      <div className="clearfix sql-toolbar">
        <div>
          <AsyncSelect
            dataEndpoint={
              '/usertablepermissionmodelview/get_dbs'
            }
            onChange={this.onChange.bind(this)}
            value={this.props.queryEditor.dbId}
            databaseId={this.props.queryEditor.dbId}
            actions={this.props.actions}
            valueRenderer={o => (
              <div>
                <span className="text-muted">Database:</span> {o.label}
              </div>
            )}
            mutator={this.dbMutator.bind(this)}
            placeholder="选择一个数据库"
          />
        </div>
        <div className="m-t-5">
          <Select
            name="select-schema"
            placeholder={`选择一个数据模型 (${this.state.schemaOptions.length})`}
            options={this.state.schemaOptions}
            value={this.props.queryEditor.schema}
            valueRenderer={o => (
              <div>
                <span className="text-muted">Schema:</span> {o.label}
              </div>
            )}
            isLoading={this.state.schemaLoading}
            autosize={false}
            onChange={this.changeSchema.bind(this)}
          />
        </div>
        <div className="m-t-5">
          {this.props.queryEditor.schema &&
            <Select
              name="select-table"
              ref="selectTable"
              isLoading={this.state.tableLoading}
              value={this.state.tableName}
              placeholder={`Add a table (${this.state.tableOptions.length})`}
              autosize={false}
              onChange={this.changeTable.bind(this)}
              filterOptions={this.state.filterOptions}
              options={this.state.tableOptions}
            />
          }
          {!this.props.queryEditor.schema &&
            <Select
              async
              name="async-select-table"
              ref="selectTable"
              value={this.state.tableName}
              placeholder={'输入搜索表 ...'}
              autosize={false}
              onChange={this.changeTable.bind(this)}
              loadOptions={this.getTableNamesBySubStr.bind(this)}
            />
          }
        </div>
        <hr />
        <div className="m-t-5">
          <div className="scrollbar-container">
            <div className="scrollbar-content" style={{ height: tableMetaDataHeight }}>
              {this.props.tables.map(table => (
                <TableElement
                  table={table}
                  key={table.id}
                  actions={this.props.actions}
                />
              ))}
            </div>
          </div>
        </div>
        {shouldShowReset &&
          <Button bsSize="small" bsStyle="danger" onClick={this.resetState.bind(this)}>
            <i className="fa fa-bomb" /> Reset State
          </Button>
        }
      </div>
    );
  }
}
SqlEditorLeftBar.propTypes = propTypes;
SqlEditorLeftBar.defaultProps = defaultProps;

export default SqlEditorLeftBar;
