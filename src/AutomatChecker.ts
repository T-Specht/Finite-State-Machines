import { AutomatDelta } from "./AutomatConverter";

let A: AutomatDelta = {
    "q0": {
        "0": ["q1", "q2"],
        "1": ["q0", "q1"]
    },
    "q1": {
        "0": ["q2"],
        "1": ["q0"]
    },
    "q2": {
        "0": [],
        "1": ["q1", "q2"]
    }
}


export function checkWordNEA(A: AutomatDelta, F: string[], start: string, word: string[]){
    // Current list of possible ending states is just the start state
    let tmp: string[] = [start];
    // For every input in word
    for(let i of word){
        // Find the next states from all current possible states with the given input
        // Store them in variable filter, in a way so each state is only included once
        let filter: string[] = [];
        tmp.map(s => {
            let next = A[s][i];
            return next;
        }).flat().forEach(t => !filter.includes(t) && filter.push(t));
        tmp = filter;
    }
    // Return true if tmp includes an accepting end state
    return F.some(f => tmp.includes(f));
}


export function checkWordNEAAbleitung(A: AutomatDelta, F: string[], start: string, word: string[]){
    // Current list of possible ending states is just the start state
    // This also stores the history of previous states
    let tmp: {
        current: string,
        previous: string[]
    }[] = [{
        current: start,
        previous: []
    }];
     // For every input in word
    for(let i of word){
        // Find the next states from all current possible states with the given input
        // Store the previous states in attribute previous
        tmp = tmp.map(s => {
            let next = A[s.current][i];
            return next.map(n => ({
                current: n,
                previous: [...s.previous, s.current]
            }));
        }).flat();
    }
    
    // Return object with information whether the word is accepted and the corresponding ways 
    return {
        isAccepted: F.some(f => tmp.map(t => t.current).includes(f)),
        acceptedWays: tmp.filter(t => {
            return F.some(f => f == t.current);
        })
    }
}

//console.log(checkWordNEAAbleitung(A, ["q2"], "q0", "10101110101010101001".split('')));
