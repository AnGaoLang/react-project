
import * as React from 'react';
import Square from '../square/square';
import './board.css';

type IClick = (n:number) => void // 类型别名(起别名不会新建一个类型 - 它创建了一个新 名字来引用那个类型),当接口内部为单个声明时，可以用类型别名简写接口

interface IProps {
  square: string[],
  xIsNext: boolean,
  clickHandle: IClick,
}

interface IState {
  square: string[],
  xIsNext: boolean
}

class Board extends React.Component <IProps, IState> {
  public squareRef:any = React.createRef();
  public getRefs:any

  public renderSquare (n: number, i?: string) {
    // 但ts中报错this具有隐式的any类型时，需在函数体顶部用that代替
    // const that = this;
    // console.log(this.getRefs); // 此处还未获取到<Square>内的dom节点

    // 定义在<Square>上的所有属性(JSX属性)都会被当作props对象的属性传入组件内部
    return(
      // 使用props传递函数时,必须传入一个未执行的函数(所有{}内的表达式都适用)
      // 1.直接传入函数体(this.returnHandle)(不能带()表示执行,否则传入子组件的是undfined);适用于不带参数的函数的传递
      // 2.将函数嵌入匿名但未执行的函数传入子组件，适用于带参数的函数传入，表示立即执行() => this.boardhandle(n);
      <Square
        key={`square${n}`}
        name = {this.props.square[n]}
        value = {n}
        boardhandle = {() => this.props.clickHandle(n)}
        getRef={(ele:any) => {console.log(this.getRefs);this.getRefs = ele }} // 运行到函数内部才获取到a的dom节点，通过props向组件内部传入了一个函数体
        ref={this.squareRef} // 获取的是该组件的实例
      />
    )
  }

  public render () {
    // 创建对应数组
    let boardRow = Array(3).fill([]);
    boardRow.forEach((item, index) => {
      let innerArray = [];
      for (let i=0; i < 3; i++) {
        innerArray.push(i + (index * 3));
      };
      boardRow[index] = innerArray;
    });
    // 创建对应的jsx的渲染数组
    const boardRowElement = boardRow.map((item, index) => {
      const squareArray = item.map((item1:number) => {
        return this.renderSquare(item1)
      })
      return (
        <div className="board-row" key={`board${index}`}>{squareArray}</div>
      )
    })

    return (
      <div>{boardRowElement}</div>
      // <context1.Consumer>
      //   {((value:string) => )}
      // </context1.Consumer>
    );
  }

}

export default Board
