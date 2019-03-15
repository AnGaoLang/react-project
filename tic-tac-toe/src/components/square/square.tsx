import * as React from 'react';
// import * as ReactDom from 'react-dom'
import './square.css';
import ErrorBoundary from '../errorBoundary/errorBoundary';

type IClick = () => void
type IRefs = (ele: any) => void
interface IProps {
  name?: string,
  value?: number,
  boardhandle: IClick,
  getRef: IRefs
}
interface IState {
  value: string
}

class Square extends React.Component <IProps, IState> {
  // 类的静态成员，这些属性存在于类本身上面而不是类的实例上，不依赖于该类的任何实例,所以无法在this上访问，只能直接在类Square上访问
  // static方法叫静态方法，也叫类方法，就是在程序启动的时候，就会为这个方法分配一块内存空间，所以什么时候都可以调用这个方法。
  // 没有static的其他方法，非静态方法，必须在类实例化时，才有内存空间，所以在类实例化之前是无法调用的。
  // 所以，静态方法里不能调用非静态方法，除非你先实例化那个类。
  public static prop: string = '111111'
  public el:HTMLElement

  constructor (props: IProps) {
    super(props);
    //  this.state = {
    //    value: ''
    //  }

    // portal插槽
    // this.el = document.createElement('span');
    // document.body.appendChild(this.el);
    // 这边重新绑定this是必要的，这样 `this` 才能在回调函数中使用,指向当前类的实例
    // 如果传递一个函数名给一个变量，之后通过函数名()的方式进行调用，在方法内部如果使用this则this的指向会丢失。
    this.squareClicked = this.squareClicked.bind(this);
  }

  public render () {

    // portal 可以被放置在 DOM 树的任何地方，但其他方面行为和普通的 React 子节点行为一致。
    // 如上下文特性依然能够如之前一样正确地工作，无论其子节点是否是 portal。另外，由于portal 仍存在于 React 树中，而不用考虑其在 DOM 树中的位置。
    // 包括事件冒泡。一个从 portal 内部会触发的事件会一直冒泡至包含 React 树 的祖先。尽管他在dom树中的实际位置已不再app根节点之下
    // return ReactDom.createPortal((
    return (
      <ErrorBoundary>
        <a
          className="square"
          onClick={this.squareClicked}
          ref={this.props.getRef} // 接受从父组件传递进来的函数体
        >
          {/* {this.state.value} */}
          {this.props.name}
          {/*this.props.value} */}
        </a>
      </ErrorBoundary>
    )  
    // ), this.el)
  }

  // 事件处理方法
  // this指向当前类的实例，而不是类自身，所以private和static内的this指向undefined
  public squareClicked () {
    // React的setState方法是个异步方法.所以,若是在setState之后立即访问state,往往是不能得到更新之后的state值的

    // const promise = Promise.resolve(this.setState({value: 'X'}));
    // const promise = new Promise((resolve, reject) => {
    //   this.setState(this.state.value === 'X' ? {value: 'O'} :{value: 'X'});
    //   resolve();
    // })
    // promise.then(() => {
    //   console.log(this.state)
    // })
    this.props.boardhandle()
  }
}

export default Square


// 这种只有 render 方法的组件提供了一种更简便的定义组件的方法：=> 函数定义组件
// 注意时间处理函数不能写成 onClick={props.onClick()}
// props.onClick 方法会在 Square 组件渲染时被直接触发而不是等到 Board 组件渲染完成时通过点击触发，
// 又因此时 Board 组件正在渲染中（即 Board 组件的 render() 方法正在调用），又触发 boardhandle(n) 方法调用 setState() 会再次调用 render() 方法导致死循环。
// export default function Square (props:IProps) {
//   return (
//     <a className="square" onClick={props.boardhandle}>
//       {props.name}
//     </a>
//   )
// }