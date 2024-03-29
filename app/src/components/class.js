import React from "react";
import { Table, Divider, Icon, Form, Input, Button, message, Popconfirm } from "antd";
import { removeClass, createClass, getClasses } from "../requests";

export default class ClassPage extends React.PureComponent {
  constructor() {
    super();
    this.state = { classes: [], hasData: false };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    getClasses().then(data => {
      this.setState({ classes: data });
    });
  }

  async add(name) {
    await createClass(name);
    this.init();
  }
  async remove(id) {
    await removeClass(id);
    this.init();
  }

  render() {
    return (
      <div>
        <WrappedClassForm create={name => this.add(name)} />
        <ClassTable
          classes={this.state.classes}
          hasData={this.state.hasData}
          remove={id => this.remove(id)}
        ></ClassTable>
      </div>
    );
  }
}
function cancel(e) {
  console.log(e);
  message.error("Cancelled");
}
class ClassTable extends React.PureComponent {
  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (text, record) => (
          <span>
            <a>View</a>
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure delete this race?"
              onConfirm={() => this.props.remove(record.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            ><a>Delete</a></Popconfirm>
            <Divider type="vertical" />
          </span>
        )
      }
    ];
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={this.props.classes}
        hasData={this.props.hasData}
      />
    );
  }
}

class RaceForm extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.create(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Form.Item>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Input class name!" }]
          })(
            <Input
              prefix={<Icon type="team" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Class"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Quick Add
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const WrappedClassForm = Form.create({
  name: "create-race"
})(RaceForm);
