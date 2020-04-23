import React from 'react';
import {Layout, Menu} from 'antd';
import {Link} from 'umi';
import {BulbOutlined, CarryOutOutlined, DatabaseOutlined} from '@ant-design/icons';
import styles from './mainLayout.less';

const {Sider, Content} = Layout;
const {SubMenu} = Menu;
export default class MainLayout extends React.PureComponent {

  rootSubmenuKeys = ['data', 'scheme', 'rule', 'schedule'];

  state = {
    openKeys: [''],
    selectedKeys: ['']
  };

  constructor(props) {
    super(props);
    // @ts-ignore
    let pathname = props.location.pathname;
    if (pathname === '/' || pathname === '/scheme') {
      pathname = '/scheme/scheme';
    }
    this.state.selectedKeys = [pathname]
    this.state.openKeys = [pathname.substr(1).split("/")[0]]
  }

  onOpenChange = (openKeys ) => {
    const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({openKeys});
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  onClick = (e) => {
    this.setState({
      selectedKeys: e.key
    });
  }

  render() {
    const {children} = this.props;
    return (
      <Layout className={styles.layoutContainer}>
        <Sider width={160} theme={'light'}>
          <Menu
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            selectedKeys={this.state.selectedKeys}
            onClick={this.onClick}
            style={{width: 160}}
          >
            <SubMenu
              key="data"
              title={
                <span>
                  <DatabaseOutlined />
                  <span>基础数据</span>
                </span>
              }
            >
              <Menu.Item key="/data/subject">
                <Link to={"/data/subject"}>科目信息</Link>
              </Menu.Item>
              <Menu.Item key="/data/teacher">
                <Link to={"/data/teacher"}>教师信息</Link>
              </Menu.Item>
              <Menu.Item key="/data/grade">
                <Link to={"/data/grade"}>年级信息</Link>
              </Menu.Item>
              <Menu.Item key="/data/class">
                <Link to={"/data/class"}>班级信息</Link>
              </Menu.Item>
              <Menu.Item key="/data/space">
                <Link to={"/data/space"}>场地信息</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="scheme"
              title={
                <span>
                 <BulbOutlined />
                  <span>排课方案</span>
                </span>
              }
            >
              <Menu.Item key="/scheme/scheme">
                <Link to={"/scheme/scheme"}>排课方案</Link>
              </Menu.Item>
              <Menu.Item key="/scheme/setting">
                <Link to={"/scheme/setting"}>排课设置</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="rule"
              title={
                <span>
                  <CarryOutOutlined />
                  <span>排课规则</span>
                </span>
              }>
              <Menu.Item key="/rule/section">
                <Link to={"/rule/section"}>课节设置</Link>
              </Menu.Item>
              <Menu.Item key="/rule/continuous">
                <Link to={"/rule/continuous"}>连堂课设置</Link>
              </Menu.Item>
              <Menu.Item key="/rule/classFixed">
                <Link to={"/rule/classFixed"}>班级固排禁排</Link>
              </Menu.Item>
              <Menu.Item key="/rule/teacherFixed">
                <Link to={"/rule/teacherFixed"}>教师固排禁排</Link>
              </Menu.Item>
              <Menu.Item key="/rule/subjectFixed">
                <Link to={"/rule/subjectFixed"}>科目固排禁排</Link>
              </Menu.Item>
              <Menu.Item key="/rule/spaceFixed">
                <Link to={"/rule/spaceFixed"}>场地固排禁排</Link>
              </Menu.Item>
              <Menu.Item key="/rule/teacherSpecial">
                <Link to={"/rule/teacherSpecial"}>教师特殊要求</Link>
              </Menu.Item>
              <Menu.Item key="/rule/subjectSpecial">
                <Link to={"/rule/subjectSpecial"}>科目特殊要求</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="schedule"
              title={
                <span>
                  <CarryOutOutlined />
                  <span>智能排课</span>
                </span>
              }>
              <Menu.Item key="/schedule/schedule">
                <Link to={"/schedule/schedule"}>智能排课</Link>
              </Menu.Item>
              <Menu.Item key="/schedule/timetable">
                <Link to={"/schedule/timetable"}>智能课表</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content className={styles.contentContainer}>
          {children}
        </Content>
      </Layout>
    );
  }

}
