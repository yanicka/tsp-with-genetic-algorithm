const originalCrossover = (orderA, orderB) => {
  let start = Math.floor(Math.random() * orderA.length);
  let end = Math.floor(Math.random() * orderA.length + start + 1);
  let neworder = orderA.slice(start, end);
  
  for (let i = 0; i < orderB.length; i++) {
    let city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}

export {
  originalCrossover
}