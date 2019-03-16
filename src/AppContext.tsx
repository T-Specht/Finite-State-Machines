import React, { useState, useEffect } from "react";
import { AutomatDelta } from "./AutomatConverter";
import { ShadowPropTypesIOS } from "react-native";

type Delta = {
  i: number;
  j: number;
  next: number[];
}[];

interface IAppContext {
  deltaCompiled: AutomatDelta;
  delta: Delta;
  sigmas: string[];
  Q: string[];
  F: number[];
  s: number;
  setDelta(delta: Delta): void;
  setSigmas(s: string[]): void;
  setQ(q: string[]): void;
  setF(F: number[]): void;
  setS(s: number): void;
  getStates(): string[];
  getSigma(): string[];
  compileAndSave(): AutomatDelta;
  reset(): void;
}

export const AppContext = React.createContext<IAppContext>({} as any);

const STORAGE_KEY = "APP-STORAGE-";
type ContentKeys = "DELTA" | "F" | "S" | "Q" | "SIGMA" | "DELTA_COMPILED";

function extract(key: ContentKeys) {
  const tmp = localStorage.getItem(STORAGE_KEY + key);
  return !!tmp ? JSON.parse(tmp) : null;
}

export const AppContextProviderWrapper: React.SFC = props => {
  const [deltaCompiled, setDeltaCompiled] = useState<AutomatDelta>(() => {
    return extract("DELTA_COMPILED") || {};
  });
  const [delta, setDelta] = useState<
    {
      i: number;
      j: number;
      next: number[];
    }[]
  >(() => {
    return extract("DELTA") || [];
  });
  const [F, setF] = useState<number[]>(() => {
    return extract("F") || [0];
  });
  const [s, setS] = useState<number>(() => {
    return extract("S") || 0;
  });
  const [Q, setQ] = useState<string[]>(() => {
    return extract("Q") || ["q0"];
  });
  const [sigmas, setSigmas] = useState<string[]>(() => {
    return extract("SIGMA") || ["A"];
  });

  function getStates() {
    return Object.keys(delta);
  }

  function getSigma() {
    return Object.keys(deltaCompiled[getStates()[0]]);
  }

  const SAVE_DATA: { [k in ContentKeys]: () => any } = {
    DELTA: () => delta,
    F: () => F,
    S: () => s,
    Q: () => Q,
    DELTA_COMPILED: () => deltaCompiled,
    SIGMA: () => sigmas
  };

  function save(key: ContentKeys) {
    localStorage.setItem(STORAGE_KEY + key, JSON.stringify(SAVE_DATA[key]()));
  }

  function compileAndSave() {
    const automat: AutomatDelta = {};
    Q.forEach((q, i) => {
      const qAutomat: { [input: string]: string[] } = {};
      sigmas.forEach((s, j) => {
        let potentialDelta = delta.find(d => d.i == i && d.j == j);
        let next = !!potentialDelta ? potentialDelta.next : [];
        qAutomat[s] = next.map(i => Q[i]);
      });
      automat[q] = qAutomat;
    });
    setDeltaCompiled(automat);
    return automat;
  }

  function reset(){
    setDelta([]);
    setDeltaCompiled({});
    setQ(["q0"]);
    setSigmas(["A"]);
    setF([0]);
    setS(0);
  }

  Object.keys(SAVE_DATA).map(key => {
    useEffect(() => {
      save(key as ContentKeys);
      //console.log("Saving " + key);
    }, [SAVE_DATA[key as ContentKeys]()]);
  });


  return (
    <AppContext.Provider
      value={{
        delta,
        F,
        s,
        setDelta,
        setF,
        setS,
        getStates,
        getSigma,
        Q,
        setQ,
        deltaCompiled,
        setSigmas,
        sigmas,
        setDeltaCompiled,
        reset,
        compileAndSave: compileAndSave
      }}
      children={props.children}
    />
  );
};
