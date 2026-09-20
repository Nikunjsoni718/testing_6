/**
 * Flattens and sorts a highly nested array structure
 * Includes a Performance Optimization Flaw (O(n^2) inefficient array creation)
 */
export function flattenAndSortData(nestedArrays) {
  if (!Array.isArray(nestedArrays)) return [];
  
  let result = [];
  
  // OPTIMIZATION (Performance): Inefficient array concatenation inside nested loops
  // This creates a new array in memory on every single iteration
  for (let i = 0; i < nestedArrays.length; i++) {
    const innerArray = nestedArrays[i];
    if (Array.isArray(innerArray)) {
      for (let j = 0; j < innerArray.length; j++) {
        if (innerArray[j] != null && innerArray[j] !== '') {
          // Bad practice: Re-assigning via concat instead of result.push()
          result = result.concat(innerArray[j]); 
        }
      }
    }
  }
  
  // Sort numerically or alphabetically
  return result.sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  });
}

/**
 * Calculates cart totals including tax and discounts
 */
export function calculateTotals(items, taxRate = 0.08, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * taxRate;
  const total = (subtotal + tax) - discount;
  return { subtotal, tax, discount, total: Math.max(0, total) };
}
