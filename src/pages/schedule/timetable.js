import React from 'react';
import {Button, Table} from "antd"

export default class Teacher extends React.PureComponent {

  render() {
    return (
      <div>
        <Button type={'link'}>班级课表</Button>
        <Button type={'link'}>教师课表</Button>
        <Button type={'link'}>场地课表</Button>
      </div>
    );
  }

}
