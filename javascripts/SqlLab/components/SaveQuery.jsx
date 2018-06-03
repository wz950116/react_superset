import React from 'react';
import { FormControl, FormGroup, Overlay, Popover, Row, Col } from 'react-bootstrap';
import Button from '../../components/Button';

const propTypes = {
  defaultLabel: React.PropTypes.string,
  sql: React.PropTypes.string,
  schema: React.PropTypes.string,
  dbId: React.PropTypes.number,
  animation: React.PropTypes.bool,
  onSave: React.PropTypes.func,
};
const defaultProps = {
  defaultLabel: 'Undefined',
  animation: true,
  onSave: () => {},
};

class SaveQuery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      label: props.defaultLabel,
      showSave: false,
    };
    this.toggleSave = this.toggleSave.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onLabelChange = this.onLabelChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onSave() {
    const query = {
      label: this.state.label,
      description: this.state.description,
      db_id: this.props.dbId,
      schema: this.props.schema,
      sql: this.props.sql,
    };
    this.props.onSave(query);
    this.setState({ showSave: false });
  }

  onCancel() {
    this.setState({ showSave: false });
  }

  onLabelChange(e) {
    this.setState({ label: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  toggleSave(e) {
    this.setState({ target: e.target, showSave: !this.state.showSave });
  }

  renderPopover() {
    return (
      <Popover id="embed-code-popover" >
        <FormGroup bsSize="small" style={{ width: '350px' }} >
          <Row>
            <Col md={12} >
              <small>
                <label className="control-label" htmlFor="embed-height">
                  标签
                </label>
              </small>
              <FormControl
                type="text"
                placeholder="查询标签"
                value={this.state.label}
                onChange={this.onLabelChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={12} >
              <small>
                <label className="control-label" htmlFor="embed-height">描述</label>
              </small>
              <FormControl
                componentClass="textarea"
                placeholder="为查询写一份描述"
                value={this.state.description}
                onChange={this.onDescriptionChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={12} >
              <Button
                bsStyle="primary"
                onClick={this.onSave}
                className="m-r-3"
              >
                保存
              </Button>
              <Button onClick={this.onCancel} className="cancelQuery">
                取消
              </Button>
            </Col>
          </Row>
        </FormGroup>
      </Popover>
    );
  }

  render() {
    return (
      <span className="SaveQuery" >
        <Overlay
          trigger="click"
          target={this.state.target}
          show={this.state.showSave}
          placement="bottom"
          animation={this.props.animation}
        >
          {this.renderPopover()}
        </Overlay>
        <Button bsSize="small" className="toggleSave" onClick={this.toggleSave}>
          <i className="fa fa-save" /> 保存查询
        </Button>
      </span>
    );
  }
}
SaveQuery.propTypes = propTypes;
SaveQuery.defaultProps = defaultProps;
export default SaveQuery;
