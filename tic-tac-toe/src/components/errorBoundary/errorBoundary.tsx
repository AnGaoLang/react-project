import * as React from 'react';

interface IProps {}
interface IState {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<IProps, IState> {
  constructor (props:IProps) {
    super(props)
    this.state = {
      hasError: false 
    }
  }

  public componentDidCatch () {
    this.setState({hasError: true})
  }

  public render () {
    if (this.state.hasError) {
      return <div style={{color:"red"}}>该组件出现错误</div>
    } else {
      return this.props.children
    }
  }
}