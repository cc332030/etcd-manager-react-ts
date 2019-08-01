/**
 * <p>
 *   Description: CenterView
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-16 16:26
 */
import React from "react";

import {
  Button
  ,Form
  , Input
  , Notification
} from "element-react";

import {
  EtcdNode
} from '../../entity'

import MoponEtcdValueView from "../mopon/MoponEtcdValueView";

import {
  Tools
  ,StringUtils
} from '@c332030/common-utils-ts'

import {
  KeyValueEnum
} from '@c332030/common-constant-ts'

import {
  ReactUtils
} from '@c332030/common-react-ts'

import {
  EtcdUtils
  , handleError,
} from "../../util";
import {EtcdService} from "../../service";

/**
 * Prop 类型
 */
interface PropTypes {
  loading: Function
  setThis: Function

  refresh: Function
}

/**
 * State 类型
 */
interface StateTypes {
  node: EtcdNode

  key: string
  value: string
}

export class CenterView extends React.Component<PropTypes, StateTypes> {

  state: StateTypes = {
    node: {}

    ,key: ''
    ,value: ''
  };

  constructor(props: PropTypes) {
    super(props);

    this.props.setThis(this);

    this.showNode.bind(this);
  }

  showNode(node?: EtcdNode) {

    if(!node) {
      this.setState({
        node: {}
      });
      return;
    }

    this.setState({
      node: node

      ,key: EtcdUtils.isDir(node) ? '' : StringUtils.dealNull(node.key)
      ,value: StringUtils.dealNull(node.value)
    });
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const { node, key, value } = this.state;

    if(Object.keys(node).length === 0) {
      return (
        <>
          <span>请选择节点</span>
        </>
      );
    }

    const isDir = EtcdUtils.isDir(node);

    return (
      <>
        <div style={{ paddingBottom: '1rem' }}>
          <span>节点类型：{ isDir ? '目录：' + node.key : '数据' }</span>
        </div>
        <Form labelWidth={ '60' } labelPosition={ 'right' }>

          <Form.Item label={ Tools.get(KeyValueEnum, 'key') }>
            <Input value={ key } readOnly={ !isDir } onChange={ e => {
              this.setState({ key: ReactUtils.getString(e) });
            }} />
          </Form.Item>

          <MoponEtcdValueView value={ value }
            onChange={ (value: string) => {
              this.setState({value: value})
            }}
          />

          {
            isDir &&
            <Button onClick={ () => {

              EtcdService.add(
                this.state.node
                ,this.state.key
                ,this.state.value
              ).then(() => {

                Notification.success('新增成功');

                this.props.refresh();
              }).catch(handleError);
            }} >添加</Button>
          }

          <Button onClick={ () => {

            EtcdService.update(
              this.state.node
              ,this.state.value
            ).then(() => {

              Notification.success('更新成功');

              this.props.refresh();
            }).catch(handleError);
          }}>更新</Button>

          <Button onClick={ () => {

            EtcdService.delete(
              this.state.node
            ).then(() => {

              Notification.success(`删除成功：${this.state.node.key}`);

              this.props.refresh();
              this.showNode();
            }).catch(handleError);
          }}>删除</Button>
        </Form>
      </>
    );
  }
}
