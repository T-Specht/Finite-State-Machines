import React from "react";
import { AutomatDelta } from "./AutomatConverter";
import { Table, TableBody, Dropdown } from "semantic-ui-react";

function format(value: string[] | string, braces: boolean) {
  if (braces) {
    if (typeof value == "string") {
      return `{${value}}`;
    } else {
      if (value.length == 0) {
        return "∅";
      } else {
        return `{${value.join(", ")}}`;
      }
    }
  } else {
    if (typeof value == "string") {
      return `${value}`;
    } else {
      if (value.length == 0) {
        return "∅";
      } else {
        return `${value.join(", ")}`;
      }
    }
  }
}

const ATableDisplay: React.SFC<{
  automat: AutomatDelta;
  braces: boolean;
}> = ({ automat, braces }) => {
  const Q = Object.keys(automat);
  const sigmas = Object.keys(automat[Q[0]]);
  return (
    <Table celled definition>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {sigmas.map((s, i) => {
            return <Table.HeaderCell key={i}>{s}</Table.HeaderCell>;
          })}
        </Table.Row>
      </Table.Header>
      <TableBody>
        {Q.map((q, i) => {
          return (
            <Table.Row key={i}>
              <Table.Cell key={-1}>{format(q, braces)}</Table.Cell>
              {sigmas.map((s, j) => {
                return (
                  <Table.Cell key={j}>
                    {format(automat[q][s], braces)}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ATableDisplay;
