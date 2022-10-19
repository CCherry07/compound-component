/** @jsxImportSource @emotion/react */
import React from 'react'
import posed from 'react-pose'
import { css as emoCSS } from '@emotion/react'
import styled from '@emotion/styled'

const css = (...args: any[]) => ({ ...emoCSS(...args) })
type ActionType = 'opening' | "closing"
const single = (state: number[], changes: { type: ActionType; activeIndex: number }) => {
  switch (changes.type) {
    case "opening":
      return [changes.activeIndex]
    case "closing":
      return []
    default:
      break;
  }
  return state
}
// const combineReducers = (...reducers: { (state: any, changes: any): any; (state: any, changes: any): any; (state: any, changes: any): any }[]) => (state: any, changes: any) =>
//   reducers.reduce((acc, reducer) => reducer(state, acc), changes)

const AccordionContext = React.createContext<AccordionContext | null>(null)
interface BaseAccordionProps {
  stateReducer?: React.Reducer<any, any>
  children?: React.ReactElement;
}
function BaseAccordion(props: BaseAccordionProps) {
  const [openIndexes, dispatch] = React.useReducer(single, [0])
  return <AccordionContext.Provider value={{ openIndexes, dispatch }} {...props} />
}
interface AccordionContext {
  openIndexes: number[],
  dispatch: React.Dispatch<{
    type: ActionType;
    activeIndex: number;
  }>
}
const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("")
  return context
}
function AccordionButton({ children: child, activeIndex }: { children: React.ReactElement, activeIndex: number }) {
  const { openIndexes, dispatch } = useAccordionContext()
  const isOpen = openIndexes.includes(child.props.activeIndex)
  return <AccordionButtonBase isOpen={isOpen}>
    {React.cloneElement(child, {
      onClick: (...args: []) => {
        const closing = openIndexes.includes(activeIndex)
        const type = closing ? "closing" : "opening"
        console.log(type);
        dispatch({ type, activeIndex })
        child.props.onClick && child.props.onClick(...args)
      },
    })}
  </AccordionButtonBase>
}

const AccordionButtonBase = styled('button')(
  {
    textAlign: 'left',
    minWidth: 80,
    cursor: 'pointer',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    border: 'none',
    backgroundColor: 'unset',
    ':focus': {
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
  },
  ({ isOpen }: { isOpen: boolean }) =>
    isOpen
      ? {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }
      : null,
)

const PoseAccordionContents = posed.div({
  open: { maxHeight: 200 },
  closed: { maxHeight: 0 },
})

interface AccordionContentsProps {
  activeIndex: number
  children: React.ReactElement
}
function AccordionContents(props: AccordionContentsProps) {
  const { openIndexes } = useAccordionContext()
  const isOpen = openIndexes.includes(props.activeIndex)
  return (
    <PoseAccordionContents
      pose={isOpen ? 'open' : 'closed'}
      style={{ overflowY: 'hidden', textAlign: 'justify' }}
      {...props}
    />
  )
}

const AccordionItem = styled('div')(
  {
    display: 'grid',
    gridTemplate: 'auto auto',
    gridGap: 4,
    gridAutoFlow: 'row',
  },
  (props: { direction: 'horizontal' | 'column' | 'row' | 'vertical' }) => ({
    gridAutoFlow: props.direction === 'horizontal' ? 'column' : 'row',
  }),
)

const TabButtons = styled('div')({ display: 'flex' })
const TabButton = styled(AccordionButtonBase)({
  textAlign: 'center',
})
const TabItems = styled('div')({
  position: 'relative',
  minHeight: 120,
})

const BelowTabItem = posed.div({
  open: { opacity: 1, top: 0 },
  closed: { opacity: 0, top: 30 },
})

const AboveTabItem = posed.div({
  open: { opacity: 1, bottom: 0 },
  closed: { opacity: 0, bottom: 30 },
})

interface TabItemProps {
  position: string, isOpen: boolean, children: React.ReactElement,
  pose?: 'open' | 'closed',
  style?: React.CSSProperties
}
function TabItem({ position, isOpen, ...props }: TabItemProps) {
  props = {
    pose: isOpen ? 'open' : 'closed',
    style: { position: 'absolute', overflowY: 'hidden' },
    ...props,
  }

  return position === 'above' ? (
    <AboveTabItem {...props} />
  ) : (
    <BelowTabItem {...props} />
  )
}



export {
  css,
  BaseAccordion,
  AccordionButton,
  AccordionButtonBase,
  AccordionItem,
  AccordionContents,
  AboveTabItem,
  BelowTabItem,
  TabItem,
  TabItems,
  TabButton,
  TabButtons,
  single,
}
