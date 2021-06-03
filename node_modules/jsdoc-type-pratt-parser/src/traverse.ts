import { NonTerminalResult } from './result/NonTerminalResult'
import { TerminalResult } from './result/TerminalResult'

type NodeVisitor = (node: NonTerminalResult, parentNode?: NonTerminalResult, property?: string) => void

function _traverse (node: NonTerminalResult, parentNode?: NonTerminalResult, property?: string, onEnter?: NodeVisitor, onLeave?: NodeVisitor): void {
  onEnter?.(node, parentNode, property)
  if ('left' in node && node.left !== undefined) {
    _traverse(node.left, node, 'left', onEnter, onLeave)
  }
  if ('element' in node && node.element !== undefined) {
    _traverse(node.element, node, 'element', onEnter, onLeave)
  }
  if ('elements' in node && node.elements !== undefined) {
    for (const element of node.elements) {
      _traverse(element, node, 'elements', onEnter, onLeave)
    }
  }
  if ('parameters' in node && node.parameters !== undefined) {
    for (const param of node.parameters) {
      _traverse(param, node, 'parameters', onEnter, onLeave)
    }
  }
  if ('right' in node && node.right !== undefined) {
    _traverse(node.right, node, 'right', onEnter, onLeave)
  }
  if ('returnType' in node && node.returnType !== undefined) {
    _traverse(node.returnType, node, 'returnType', onEnter, onLeave)
  }
  onLeave?.(node, parentNode, property)
}

export function traverse (node: TerminalResult, onEnter?: NodeVisitor, onLeave?: NodeVisitor): void {
  _traverse(node, undefined, undefined, onEnter, onLeave)
}
