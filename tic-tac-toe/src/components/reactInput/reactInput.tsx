import * as React from 'react';
import './reactInput.css';
// 引入context,使用context需引入，Consumer需要返回一个reactNode
import { TextContext } from '../../context/context';

// 组件可以接受任意元素，包括基本数据类型、React 元素或函数。
// 如果要在组件之间复用 UI 无关的功能，建议将其提取到单独的 JavaScript 模块中。这样可以在不对组件进行扩展的前提下导入并使用该函数、对象或类。

type inputChange = (event:any) => void

interface IProps {
  value: string
  change: inputChange
}

interface IState {
  value: string
}

interface IRefs {
  current: HTMLDivElement | null
}

// 状态提升：首先，将其自身的 state 从组件中移除，使用 this.props.value 替代 this.state.value ，
// 其次，当我们想要响应数据改变时，使用父组件提供的 this.props.change() 而不是this.setState() 方法。
// 注意：在父组件的处理函数中提供的形参是value，而非event合成事件对象。event需在子目标组件内获取
class ReactInput extends React.Component <IProps, IState> {
  // 属性声明需放在constructor前,先声明成员变量，然后在构造函数内赋值
  public myRef: IRefs

  constructor (props:IProps) {
    super(props)
    // this.state = {
    //   value: '请输入内容'
    // }
    this.myRef = React.createRef();
    this.inputChange = this.inputChange.bind(this);
    this.changeHandle = this.changeHandle.bind(this);
  }
  

  public componentDidMount () {
    console.log(this.props);
    // ThemeContext value is this.props.theme
  }

  public render () {
    return (
      // 组件内部状态控制
      // <input type="text" 
      //  value={this.state.value} 
      //  onChange={this.inputChange}/>

      // state状态提升到父组件
      <TextContext.Consumer>
        {(value: string) => {
          return (
            <div ref={this.myRef}>
              <input type="text"
                aria-label='labelText'
                value={this.props.value}

                // 方法1，传入input表单的值，而非input的event对象
                // onChange={(e) => this.props.change(e.target.value)}
                // onChange={this.changeHandle}

                // 方法2：直接传入input的event对象
                onChange={this.props.change}
              />
              <div>{value}</div>
            </div>
          )}
        }
      </TextContext.Consumer>
    )
  }

  // 方法1，传入input表单的值，而非input的event对象
  public changeHandle (e:any) {
    this.props.change(e.target.value)
  }

  // 组件内部状态控制
  public inputChange (event:any) {
    console.log(event)
    this.setState({
      value: event.target.value
    })
  }
}

export default ReactInput

// FancyButton.js 子组件
// 接受props和ref作为参数
// 返回一个React 组件
// export default const FancyButton = React.forwardRef((props, ref) => (
//     <button class="fancybutton" ref={ref}>
//     {props.children}
//   </button>
// ));

// // 父组件
// class App extends React.Component {

//   constructor(props) {
//     super(props);
//     // 创建一个ref 名字随意
//     this.fancyButtonRef = React.createRef();
//   }
  
//   componentDidMount() {
//     console.log('ref', this.ref);
//     // this.ref.current 表示获取ref指向的DOM元素
//     this.ref.current.classList.add('primary'); // 给FancyButton中的button添加一个class
//     this.ref.current.focus(); // focus到button元素上
//   }
  
//   render() {
//     // 直接使用ref={this.fancyButtonRef}
//     return (
//         <FancyButton ref={this.fancyButtonRef}>子组件</FancyButton>
//     );
//   }
// }
