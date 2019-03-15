import * as React from 'react';
// import * as ReactDom from 'react-dom' 引入react-dom
// 警告: 组件名称必须以大写字母开头(否则会被认为是默认的html标签)。内置组件即原始html标签才能小写
import Board from '../board/board';
import ReactInput from '../reactInput/reactInput';
import './App.css';

import logo from './logo.svg';

// 引入context
import { TextContext } from '../../context/context';

// props为从外部传入组件内部的数据。React是单向数据流，所以props基本上也就是从服父级组件向子组件传递的数据。

// 父组件默认下传入props:{},次props:{}会在react内部传递,若不声明相应的空接口，会报错
// props除了可以传递基本数据类型，还可以传递父组件的函数到子组件，然后在子组件触发调用

// props经常被用作渲染组件和初始化状态，当一个组件被实例化之后，它的props是只读的，不可改变的。
// 如果props在渲染过程中可以被改变，会导致这个组件显示的形态变得不可预测。只有通过父组件重新渲染的方式才可以把新的props传入组件中。

// 警告：无论论是使用函数或是类来声明一个组件，决不能修改它自己的props (类似于纯函数，不改变它自己的输入值，即改变传入的参数本身)
// props的泛型类型接口
interface IProps {}

// 一个组件的显示形态可以由数据状态和外部参数所决定，外部参数也就是props，而数据状态就是state。
// state的主要作用是用于组件保存、控制以及修改自己的状态，它只能在constructor中初始化。
// 它算是组件的私有属性，不可通过外部访问和修改，完全受控于当前组件，只能通过组件内部的this.setState来修改，修改state属性会导致组件的重新渲染。
// 注意：通过this.state=来初始化state，使用this.setState来修改state，constructor是唯一能够初始化的地方。

// setState接受一个对象或者函数作为第一个参数，只需要传入需要更新的部分即可，不需要传入整个对象。
// setState会触发视图更新,不论数据是否改变，触发视图更新便会触发 render() 渲染函数
// this.state = {name:'axuebin',age:25,} => this.setState({age:18})
// setState还可以接受第二个参数，它是一个函数，会在setState调用完成并且组件开始重新渲染时被调用，可以用来监听渲染是否完成。

// 每个组件的 state 都是它私有的，所以我们不可以直接在子组件当中进行修改
// state的泛型类型接口
interface IState {
  history: any[]
  stepNum: number
  xIsNext: boolean
  isReverse: boolean
  inputValue: string
}

// props和state的区别
// 1.state是组件自己管理数据，控制自己的状态，可变；
// 2.props是外部传入的数据参数，不可变；
// 3.没有state的叫做无状态组件，有state的叫做有状态组件；
// 4.多用props，少用state。也就是多写无状态组件。

// 不同的html节点类型对应不同的类型声明
// interface IRefs {
//   current:any
// }

// Component 这个泛型类， P(IProps) 代表 Props 的类型， S(IState) 代表 State 的类型。
class App extends React.Component<IProps, IState> {
  // 访问ref，获取html节点实例
  // public myRef:IRefs
  public node:HTMLDivElement

  // 泛型声明需全，否则IState会成为props的类型
  constructor(props: IProps) {
    super(props);  // 此处需传入必传参数props
    this.state = {
      history: [{
          squares: Array(12).fill('')
        }],
      stepNum: 0,
      xIsNext: true,
      isReverse: false,
      inputValue: '请输入内容'
    };

    // 声明在组件上则获取的是react组件实例，注意的是，这种方法仅对 class 声明的 CustomTextInput 有效，不能用于函数式组件（因为没有实例）
    // this.myRef = React.createRef();
    this.hisReverse = this.hisReverse.bind(this);
    this.boardhandle = this.boardhandle.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  
  // 回调的方式访问ref
  public myRef = (element:HTMLDivElement) => {
    this.node = element;
    console.log(this.node)
  }

  // JSX 其实会被转化为普通的 JavaScript 对象。意味着可以在 if 或者 for 语句里使用 JSX，将它赋值给变量，当作参数传入，作为返回值都可以：
  // if (user) { return (<h1>Hello, {formatName(user)}!</h1>)}
  // 注意：使用了大括号包裹的 JavaScript 表达式时就不要再到外面套引号了。JSX 会将引号当中的内容识别为字符串而不是表达式。
  public render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const winner = this.calculateWinner(current.squares);
    let move = history.map((item, index) => {
      const desc = index ? `Move # ${index}` : 'Game Start';
      return ( // 推荐在 JSX 代码的外面扩上一个小括号，这样可以防止 分号自动插入 的 bug
        // key是 React 当中使用的一种特殊的属性,作为组件的唯一区分标识id。当元素被创建时，React 会将元素的 key 值和对应元素绑定存储起来。
        // key像是 props 的一部分，事实上无法通过 this.props.key 获取到 key 的值。React 会自动的在判断元素更新时使用 key ，而组件自己是无法获取到 key 的。
        // 组件的 keys 值并不需要在全局都保证唯一，只需要在当前的节点里保证唯一即可。
        <li key={index}>
          <a href="#" className={this.state.stepNum === index ? 'selected' : ''} onClick={() => this.jumpTo(index)}>{desc}</a>
        </li>
      )
    });
    move = this.state.isReverse ? move.reverse() : move; // 根据state正序反序历史纪录列表

    let status;
    if (winner) {
      status = 'winner' + winner;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    // 每一个JSX元素都只是 React.createElement(component, props, ...children) 的语法糖。
    // 警告:组件的返回值只能有一个根元素。这也是我们要用一个<div>来包裹所有<* />元素的原因
    return (
      <TextContext.Provider value={"外层Context传入里层的文本"}>
        <div className="App" onClick={() => console.log(11111111111111)}>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
            {/* 方法1：传入input表单的值，而非input的event对象 */}
            {/* <ReactInput value={this.state.inputValue} change={(value) => this.inputChange(value)} /> */}
            {<ReactInput value={this.state.inputValue} change={this.inputChange} />}
            <span>{this.state.inputValue}</span>
            <div><button className="reverse" onClick={this.hisReverse}>历史记录反序排列</button></div>
            <div ref={this.myRef} className="tic">
                <Board
                  // ref={this.myRef}
                  square={current.squares}
                  xIsNext={this.state.xIsNext}
                  clickHandle = {(i:number) => this.boardhandle(i)}
                />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{move}</ol>
            </div>
          </header>
        </div>
      </TextContext.Provider>
    );
  }

  public calculateWinner(squares: any[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  public hisReverse () {
    this.setState({
      isReverse: !this.state.isReverse
    })
  }

  public jumpTo (index: number) {
    this.setState({
      stepNum: index,
      xIsNext: (index % 2) ? false : true
    })
  }
  
  public boardhandle (n:number) {
    // 使用了 .slice() 方法来将之前的数组数据浅拷贝到了一个新的数组中，而不是修改已有的数组
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[n]) {return};
    squares[n] = this.state.xIsNext ? 'X' : 'O';
    // 下一步才会更新最新的history的数组，即下一步，所以history.length为当前未更新的history的数组长度
    this.setState({
      history: history.concat([{squares}]),
      stepNum: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  // 方法1：传入input表单的值，而非input的event对象
  // public inputChange (value:string) {
  //   console.log(value)
  //   this.setState({
  //     inputValue: value
  //   })
  // } 

  // 方法2：直接传入input的event对象
  public inputChange (event:any) {   
    event.persist()
    this.setState({
      inputValue: event.target.value
    })
  } 
}

export default App;
