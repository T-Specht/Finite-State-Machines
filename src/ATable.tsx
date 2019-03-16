import React, { useState, useEffect, useContext } from "react";
import { Table, TableBody, Input, Button, Dropdown } from "semantic-ui-react";
import { AutomatDelta, convertNEAtoDEA, cleanDEA } from "./AutomatConverter";
import ATableDisplay from "./ATableDisplay";
import { AppContext } from "./AppContext";

export function _clone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}

const ATable: React.SFC = () => {
  const context = useContext(AppContext);

  const { sigmas, setSigmas, Q, setQ, delta, setDelta } = context;

  function handleChangeSigma(value: string, index: number) {
    const copy = [...sigmas];
    copy[index] = value;
    setSigmas(copy);
  }
  function handleChangeQ(value: string, index: number) {
    const copy = [...Q];
    copy[index] = value;
    setQ(copy);
  }

  function handleSelectChange(values: number[], i: number, j: number) {
    const deltaCopy = _clone(delta);
    let potentialDeltaIndex = deltaCopy.findIndex(d => d.i == i && d.j == j);
    if (potentialDeltaIndex != -1) {
      deltaCopy[potentialDeltaIndex].next = values;
    } else {
      deltaCopy.push({ i, j, next: values });
    }
    setDelta(deltaCopy);
  }

  // useEffect(() => {
  //   console.log(sigmas, delta);
  // }, [sigmas, delta]);

  return (
    <div>
      <Table celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            {sigmas.map((s, i) => {
              return (
                <Table.HeaderCell key={i}>
                  <Input
                    value={s}
                    fluid
                    onChange={e => handleChangeSigma(e.target.value, i)}
                  />
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <TableBody>
          {Q.map((q, i) => {
            return (
              <Table.Row key={i}>
                <Table.Cell key={-1}>
                  <Input
                    value={q}
                    fluid
                    onChange={e => handleChangeQ(e.target.value, i)}
                  />
                </Table.Cell>
                {sigmas.map((s, j) => {
                  let potentialDelta = delta.find(d => d.i == i && d.j == j);
                  let value = !!potentialDelta ? potentialDelta.next : [];
                  return (
                    <Table.Cell key={j}>
                      <Dropdown
                        placeholder="∅"
                        fluid
                        multiple
                        selection
                        value={value}
                        search
                        onChange={(e, { value }) =>
                          handleSelectChange(value as number[], i, j)
                        }
                        options={Q.map((q, k) => ({
                          key: k,
                          value: k,
                          text: q
                        }))}
                      />
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </TableBody>
      </Table>
      <div style={{marginTop: 10, marginBottom: 10}}>
        <span style={{marginRight: 10}}>
          Startzustand
          <Dropdown
            placeholder="∅"
            selection
            value={context.s}
            search
            onChange={(e, { value }) => context.setS(value as number)}
            options={Q.map((q, k) => ({
              key: k,
              value: k,
              text: q
            }))}
          />
        </span>
        <span>
          Akzeptierende Endzustände
          <Dropdown
            placeholder="∅"
            multiple
            selection
            value={context.F}
            search
            onChange={(e, { value }) => context.setF(value as number[])}
            options={Q.map((q, k) => ({
              key: k,
              value: k,
              text: q
            }))}
          />
        </span>
      </div>

      <div>
        <Button onClick={() => setSigmas([...sigmas, ""])}>+ Eingabe</Button>
        <Button onClick={() => setQ([...Q, ""])}>+ Zustand</Button>
        <Button onClick={context.compileAndSave}>Speichern</Button>
        <Button onClick={context.reset}>Zurücksetzten</Button>
      </div>
    </div>
  );
};

export default ATable;
