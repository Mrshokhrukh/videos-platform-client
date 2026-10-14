
import { Button } from "./components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion"

function App() {

  return (
    <>
      <h1> salom </h1>

      <Button> salom </Button>

      <div className="max-w-50">
      
        <Accordion defaultValue={["item-1"]}>
          
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          
            <AccordionItem value="item-1">
              <AccordionTrigger>Guruh loyihasini qilish shartmi shartmi ?</AccordionTrigger>
              <AccordionContent>
                  Albatta,  bu juda muhim!
              </AccordionContent>
            </AccordionItem>

        </Accordion>

      </div>
    </>
  )
}

export default App
