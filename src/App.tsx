import React, { useState } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import ATable from "./ATable";
import NEAtoDEA from "./NEAtoDEA";
import WordCheck from "./WordCheck";

const AccordionInner: React.SFC<{
  title: string;
  activeByDefault?: boolean;
}> = props => {
  const [active, setActive] = useState(!!props.activeByDefault);

  return (
    <React.Fragment>
      <Accordion.Title active={active} onClick={() => setActive(!active)}>
        <Icon name="dropdown" /> {props.title}
      </Accordion.Title>
      <Accordion.Content active={active}>{props.children}</Accordion.Content>
    </React.Fragment>
  );
};

const App: React.SFC = () => {
  return (
    <Accordion fluid styled>
      <AccordionInner title="Automat eingeben" activeByDefault>
        <ATable />
      </AccordionInner>
      <AccordionInner title="NEA in DEA umwandeln">
        <NEAtoDEA />
      </AccordionInner>
      <AccordionInner title="Wort überprüfen">
        <WordCheck />
      </AccordionInner>
    </Accordion>
  );
};

export default App;
