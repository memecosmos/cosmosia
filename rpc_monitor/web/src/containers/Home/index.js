import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import { makeSelectHome } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { actionMonitorStart, actionMonitorStop } from './actions';

import { Button, List, Badge, Divider, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const Service = (props) => {
  const {service, containers} = props;

  return (
    <div className="service" style={{paddingBottom: "10px"}}>
      <List
        header={<div><p className="service-name">{service}</p><hr /></div>}
        dataSource={containers}
        renderItem={ (item) => {
          const bgColor = item.status === "200" ? "" : (item.status === "503" ? "#FFC440" : "#D93026");
          return (
            <List.Item style={{background: bgColor}}>
              <div style={{width: "100%"}}>
                <span style={{float: "left"}}>
                  <Popover content={item.hostname}>
                    <InfoCircleOutlined />
                  </Popover>
                  {item.ip}
                </span>
                <span style={{float: "right"}}>{item.data_size}</span>
              </div>
            </List.Item>
          )}
        }
      />
    </div>
  );
};

const Services = (props) => {
  const {services} = props;

  return (
    <div className="services">
      <div className="contents">
        {services.map((service, idx) => {
          return (
            <Service key={`service_${idx}`} {...service} />
          )
        })}
      </div>
    </div>
  );
};


class Index extends Component {
  componentDidMount() {
    this.props.monitorStart();
  }

  render() {
    return (
      <div className="Home">
        {/*<h1>Rpc Status</h1>*/}

        <div>
          {this.props.monitoring ? (
            <Button type="primary" onClick={() => this.props.monitorStop()}>Pause</Button>
          ) : (
            <Button type="primary" onClick={() => this.props.monitorStart()}>Resume</Button>
          )}
          <Divider type="vertical" />
          <span>
            <Badge status="default" text="Normal" /><Divider type="vertical" />
            <Badge status="error" text="Error" /><Divider type="vertical" />
            <Badge status="warning" text="Not-Synced" />
          </span>
        </div>

        <Services services={this.props.status} />
      </div>
    );
  }
}

const mapStateToProps = makeSelectHome();
const mapDispatchToProps = dispatch => ({
  monitorStart: () => dispatch(actionMonitorStart()),
  monitorStop: () => dispatch(actionMonitorStop()),
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect
)(Index);
