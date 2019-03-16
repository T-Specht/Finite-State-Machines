import React, { useState, useContext } from "react";
import { Input, Button, Divider } from "semantic-ui-react";
import { checkWordNEAAbleitung } from "./AutomatChecker";
import { AppContext } from "./AppContext";

type T = ReturnType<typeof checkWordNEAAbleitung>;

const WayDisplay: React.SFC<{
  inputs: string[];
  acceptedWay: {
    current: string;
    previous: string[];
  };
}> = props => {
  const way = [...props.acceptedWay.previous, props.acceptedWay.current];
  return (
    <div>
      {way.map((s, i) => {
        if (i == 0) {
          return <span>{s}</span>;
        } else {
          return (
            <React.Fragment>
              <span className="arrow">{props.inputs[i - 1]}</span>
              <span>{s}</span>
            </React.Fragment>
          );
        }
      })}
    </div>
  );
};

const WordCheck: React.SFC = () => {
  const [word, setWord] = useState("");
  const [checkedWay, setCheckedWay] = useState<T | null>(null);
  const context = useContext(AppContext);

  function check() {
    const tokens = word.split("");
    const checked = tokens.every(t => context.sigmas.includes(t));
    if (!checked)
      return alert("Verwende nur Buchstaben aus dem Eingabealphabet!");
    setCheckedWay(
      checkWordNEAAbleitung(
        context.deltaCompiled,
        context.F.map(f => context.Q[f]),
        context.Q[context.s],
        tokens
      )
    );
  }

  return (
    <div>
      <Input
        value={word}
        onChange={e => {
            setWord(e.target.value);
            setCheckedWay(null);
        }}
        label="Wort eingeben"
      />
      <Button onClick={check}>Überprüfen</Button>
      {checkedWay && (
        <div>
          <div>
            Das Wort wird {!checkedWay.isAccepted && <b>nicht</b>} akzeptiert!
          </div>
          {checkedWay.isAccepted && checkedWay.acceptedWays.length > 1 && <div>
              Es gibt {checkedWay.acceptedWays.length} mögliche Wege, die das Wort akzeptieren.
          </div>}
          {checkedWay.acceptedWays.map((w, i) => (
            <WayDisplay acceptedWay={w} inputs={word.split("")} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WordCheck;
