import React, { useContext, useState } from "react";
import { AppContext } from "./AppContext";
import { Checkbox, Input } from "semantic-ui-react";
import ATableDisplay from "./ATableDisplay";
import { convertNEAtoDEA, cleanDEA } from "./AutomatConverter";
import { _clone } from "./ATable";

const NEAtoDEA: React.SFC = () => {
  const context = useContext(AppContext);
  const [showAsSet, setShowAsSet] = useState(false);
  const [tryToClean, setTryToClean] = useState(false);
  const [newStatePrefix, setNewStatePrefix] = useState("d");

  const buttons = (
    <div>
      <Checkbox
        label="Mengen anzeigen"
        checked={showAsSet}
        onChange={(e, t) => setShowAsSet(t.checked!)}
      />
      <Checkbox
        label="Versuchen, unnützes zu eliminieren"
        checked={!showAsSet && tryToClean}
        disabled={showAsSet}
        onChange={(e, t) => setTryToClean(t.checked!)}
      />
      <Input
        label="Prefix für neue Zustände"
        value={newStatePrefix}
        onChange={e => setNewStatePrefix(e.target.value)}
        disabled={showAsSet}
      />
    </div>
  );

  if (Object.keys(context.deltaCompiled).length > 0) {
    let converted = convertNEAtoDEA(
      _clone(context.deltaCompiled),
      context.F.map(f => context.Q[f]),
      newStatePrefix
    );

    let automat = converted[showAsSet ? 2 : 0];

    if (tryToClean && !showAsSet) automat = cleanDEA(automat);

    return (
      <div>
        {buttons}
        <div>
          <ATableDisplay automat={automat} braces={showAsSet} />
        </div>
        <div>
            Akzeptierende Endzustände: {converted[1].join(', ')}
        </div>
      </div>
    );
  } else {
    return buttons;
  }
};

export default NEAtoDEA;
