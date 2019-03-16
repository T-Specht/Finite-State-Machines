export type AutomatDelta = {
  [state: string]: {
    [input: string]: string[];
  };
};

// let A: Automat = {
//   q0: {
//     0: ["q1", "q2"],
//     1: ["q0", "q1"]
//   },
//   q1: {
//     0: ["q2"],
//     1: ["q0"]
//   },
//   q2: {
//     0: [],
//     1: ["q1", "q2"]
//   }
// };

// let A: Automat = {
//     q0: {
//         a: ["q0", "q1"],
//         b: []
//     },
//     q1: {
//         a: ["q0"],
//         b: ["q2"]
//     },
//     q2: {
//         a: [],
//         b: ["q1", "q2"]
//     }
// };

// let E = ["q2"];

// let [_A, _E, Augmented] = convertNEAtoDEA(A, E);
// console.table(A);

// console.table(Augmented);

// console.table(cleanDEA(_A));

export function cleanDEA(A: AutomatDelta) {
  // Get necessary data
  const states = Object.keys(A);
  const sigma = Object.keys(A[states[0]]);
  const _A = {...A};

  // Find all possible next states in transition _A
  const allNextStates: string[] = [];

  for(let state of states){
      for(let i of sigma){
          const next = A[state][i][0];
          if(next && !allNextStates.includes(next)){
              allNextStates.push(next);
          }
      }
  }

  // If a state is not included in allNextStates, it cannot be reached during runtime and therefore can be deleted safely
  for(let state of states){
      if(!allNextStates.includes(state)){
          delete _A[state];
      }
  }

  // return (possibly) reduced transition
  return _A;
  
}

export function convertNEAtoDEA(
  A: AutomatDelta,
  acceptingStates: string[],
  newStatesPrefix = "d"
): [AutomatDelta, string[], AutomatDelta] {
  // Extract states from transitions
  const states = Object.keys(A);
  // Extract possible inputs from transitions
  const sigma = Object.keys(A[states[0]]);

  // Array in which states are stored which transition to more than one other state
  let additionalStates: string[][] = [];

  // Search through all the transitions and find ones which match the criteria described above
  for (let state of states) {
    for (let i of sigma) {
      // Next states from state with input i
      let nextStates = A[state][i];
      if (
        nextStates.length > 1 &&
        !additionalStates.includes(nextStates) &&
        !states.includes(nextStates.sort().join())
      ) {
        // If it matches and is not yet included in additionalStates and not a state, add it (sorted)
        additionalStates.push(A[state][i].sort());
      }
    }
  }

  // New Transitions form additional states
  let _A: AutomatDelta = {};

  // For every additional state...
  for (let as of additionalStates) {

    // Get key by joining state names (e.g. [q1, q2] => q1,q2)
    const key = as.join();
    // Create empty object
    _A[key] = {};
    for (let i of sigma) {

      // Check for all inputs i to which other states you can get from the states in array as
      let nextStates: string[] = [];
      as.forEach(s => {
        A[s][i].forEach(n => {
          if (!nextStates.includes(n)) nextStates.push(n);
        });
      });

      // Sort the possible next states and add them to the transition function
      nextStates = nextStates.sort();
      _A[key][i] = nextStates;
    }
  }

  // Augment the previous transitions with the new ones
  const augmented = { ...A, ..._A };

  if (additionalStates.length == 0) {
    // Augmentation is done, no changes during last function run
    // Clean up start

    let multiStates: string[][] = [];

    // Check which multiStates are there
    for (let state of states) {
      for (let i of sigma) {
        let nextStates = augmented[state][i];
        if (
          nextStates.length > 1 &&
          !multiStates.find(s => s.join() == nextStates.sort().join())
        ) {
          multiStates.push(nextStates.sort());
        }
      }
    }

    // Save plain augmented transition
    let augmentedBackup = JSON.parse(JSON.stringify(augmented));

    // Rename multiStates

    // Initialize new states
    let newStates = new Array(multiStates.length)
      .fill(newStatesPrefix)
      .map((e, i) => e + i);

    // Replace multi States with new state (e.g. [q1, q2] => [d1])
    for (let state of states) {
      for (let i of sigma) {
        let nextStates = augmented[state][i];
        if (nextStates.length > 1) {
          let index = multiStates.findIndex(
            m => m.join() == nextStates.sort().join()
          )!;
          augmented[state][i] = [newStates[index]];
        }
      }
    }

    // Rename, delete old states
    for (let i = 0; i < multiStates.length; i++) {
      augmented[newStates[i]] = augmented[multiStates[i].join()];
      delete augmented[multiStates[i].join()];
    }

    // Calculate new accepting States
    let newAcceptingStates = multiStates
      .map(s => s.some(e => acceptingStates.includes(e)))
      .map((s, i) => (s ? newStates[i] : null))
      .filter(e => e != null);

    // Return converted
    return [augmented, [...acceptingStates, ...newAcceptingStates], augmentedBackup];
  } else {
    // NEA was augmented, run function again recursively
    return convertNEAtoDEA(augmented, acceptingStates, newStatesPrefix);
  }
}
