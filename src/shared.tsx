/** @jsxImportSource @emotion/react */
import React from 'react'
import posed from 'react-pose'
import { css as emoCSS } from '@emotion/react'
import styled from '@emotion/styled'

const css = (...args: any[]) => ({ ...emoCSS(...args) })

const AccordionContext = React.createContext<AccordionContext | null>(null)
function BaseAccordion(props: JSX.IntrinsicAttributes) {
  const [openIndexes, setOpenIndexes] = React.useState([0])
  return <AccordionContext.Provider value={{ openIndexes, setOpenIndexes }} {...props} />
}
interface AccordionContext {
  openIndexes: number[],
  setOpenIndexes: React.Dispatch<React.SetStateAction<number[]>>
}
const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("")
  return context
}
function AccordionButton({ children: child, ...props }: { children: React.ReactElement }) {
  const { openIndexes, setOpenIndexes } = useAccordionContext()
  return React.cloneElement(child, {
    onClick: (index: number) => {
      const closing = openIndexes.includes(index)
      setOpenIndexes((state) => {
        return closing
          ? state.filter(i => i !== index)
          : [...state, index]
      })
    },
    isOpen: openIndexes.includes(child.props.activeIndex)
  })
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
  isOpen: boolean
}
function AccordionContents({ isOpen, ...props }: AccordionContentsProps) {
  return (
    <PoseAccordionContents
      pose={isOpen ? 'open' : 'closed'}
      {...css({ overflowY: 'hidden', textAlign: 'justify' })}
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
  (props: { direction: 'horizontal' | 'column' | 'row' }) => ({
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

function TabItem({ position, isOpen, ...props }: { position: string, isOpen: string }) {
  props = {
    pose: isOpen ? 'open' : 'closed',
    ...css({ position: 'absolute', overflowY: 'hidden' }),
    ...props,
  }
  return position === 'above' ? (
    <AboveTabItem {...props} />
  ) : (
    <BelowTabItem {...props} />
  )
}

const preventClose = (state: { openIndexes: string | any[] }, changes: { type: string }) =>
  changes.type === 'closing' && state.openIndexes.length < 2
    ? { ...changes, openIndexes: state.openIndexes }
    : changes

const single = (state: any, changes: { type: string; openIndexes: string | any[] }) =>
  changes.type === 'opening'
    ? { ...changes, openIndexes: changes.openIndexes.slice(-1) }
    : changes

const combineReducers = (...reducers: { (state: any, changes: any): any; (state: any, changes: any): any; (state: any, changes: any): any }[]) => (state: any, changes: any) =>
  reducers.reduce((acc, reducer) => reducer(state, acc), changes)

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
  combineReducers,
  preventClose,
  single,
}
