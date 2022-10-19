import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BaseAccordion,
  preventClose,
  AccordionButton,
  AccordionItem,
  AccordionContents,
  single,
  TabButton,
  TabItem,
  TabItems,
  TabButtons,
  BaseAccordionProps,
} from './shared.hook'
interface Item {
  title: string,
  contents: any,
}
interface AccordionProps {
  items: Item[]
}
function Accordion({ items, ...props }: AccordionProps) {
  return (
    <BaseAccordion stateReducer={preventClose} {...props}>
      <div>
        {items.map((item: { title: string; contents: any }, index: any) => (
          <AccordionItem key={item.title} direction="vertical">
            <AccordionButton activeIndex={index}>
              <div>
                {item.title}
                <span>{true ? '👇' : '👈'}</span>
              </div>
            </AccordionButton>
            <AccordionContents activeIndex={index}>
              {item.contents}
            </AccordionContents>
          </AccordionItem>
        ))}
      </div>
    </BaseAccordion >
  )
}

function BaseTabs({ stateReducer, ...props }: BaseAccordionProps) {
  return (
    <BaseAccordion
      stateReducer={stateReducer}
      {...props}
    />
  )
}

function Tabs({ items }: { items: Item[] }) {
  return (
    <BaseTabs stateReducer={single}>
      <div>
        <TabItems>
          {items.map((item, index) => (
            <TabItem
              key={index}
              activeIndex={index}
              position="above"
            >
              {item.contents}
            </TabItem>
          ))}
        </TabItems>
        <TabButtons>
          {items.map((item, index) => (
            <TabButton key={index} activeIndex={index}>
              <div>
                {item.title}
              </div>
            </TabButton>
          ))}
        </TabButtons>
      </div>
    </BaseTabs>
  )
}

const items = [
  {
    title: '🐴',
    contents: (
      <div>
        Horses can sleep both lying down and standing up. Domestic horses have a
        lifespan of around 25 years. A 19th century horse named 'Old Billy' is
        said to have lived 62 years.
      </div>
    ),
  },
  {
    title: '🦏',
    contents: (
      <div>
        Rhino skin maybe thick but it can be quite sensitive to sunburns and
        insect bites which is why they like wallow so much – when the mud dries
        it acts as protection from the sunburns and insects.
      </div>
    ),
  },
  {
    title: '🦄',
    contents: (
      <div>
        If you’re looking to hunt a unicorn, but don’t know where to begin, try
        Lake Superior State University in Sault Ste. Marie, Michigan. Since
        1971, the university has issued permits to unicorn questers.
      </div>
    ),
  },
]

function App() {
  return (
    <div
      style={{
        maxWidth: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 60,
      }}
    >
      <Tabs items={items} />
    </div>
  )
}

// ReactDOM.render(<App />, document.getElementById('root'))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
