import React, { PureComponent, ReactNode, FC } from "react"
import { createPortal } from 'react-dom'

export class MyWindowPortal extends PureComponent {
  containerEl: HTMLDivElement
  externalWindow: Window | null
  constructor(readonly props: { children: ReactNode }) {
    super(props)
    this.containerEl = document.createElement('div');
    this.externalWindow = null;
  }
  
  render() {
    return createPortal(this.props.children, this.containerEl);
  }

  componentDidMount() {
    this.externalWindow = window.open(
      '', 
      '', 
      `width=${window.screen.width},height=${window.screen.height}`
    );
    this.externalWindow?.document.body.appendChild(this.containerEl);
  }

  componentWillUnmount() {
    this.externalWindow?.close();
  }
}