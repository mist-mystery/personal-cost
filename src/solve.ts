function dfs(
  coeffs: readonly number[],
  target: number,
  index: number,
  min_value: number,
  asc: boolean,
  current: number[],
  solutions: number[][]
) {
  const coeff = coeffs[index]!;

  if (index === coeffs.length - 1) {
    if (target % coeff === 0) {
      const x = target / coeff;
      if (x >= min_value) {
        current.push(x);
        solutions.push([...current]);
        current.pop();
      }
    }
    return;
  }

  for (let x = min_value; x <= target / coeff; x++) {
    const used = coeff * x;

    if (used > target) {
      break;
    }

    current.push(x);
    dfs(coeffs, target - used, index + 1, asc ? x : 1, asc, current, solutions);
    current.pop();
  }
}

function solve_asc(coeffs: readonly number[], target: number): number[][] {
  const solutions: number[][] = [];
  const current: number[] = [];

  if (coeffs.length !== 0) {
    dfs(coeffs, target, 0, 1, true, current, solutions);
  }

  return solutions;
}

export function count_total_prime_factors(n: number) {
  const factor_counts: number[] = Array(n + 1).fill(0);

  for (let i = 2; i <= n; i++) {
    if (factor_counts[i] === 0) {
      let j = i;
      while (j <= n) {
        let k = j;
        while (k % i === 0) {
          factor_counts[j]! += 1;
          k /= i;
        }
        j += i;
      }
    }
  }

  return factor_counts;
}

export type RoleCost = {
  role: string;
  cost: number;
  count: number;
};

export function solve_indefinite_equation(
  input: readonly RoleCost[],
  targetAmount: number
): [number, number[]][] {
  const costs = input.map(({ cost }) => cost);
  const solutions = solve_asc(costs, targetAmount);

  const manpower = input.map(({ count }) => count);
  const solution_variances = solutions
    .filter((solves) => solves.every((c, i) => c % (manpower[i] ?? 1) === 0))
    .map((solves) => {
      const mean = solves.reduce((acc, x) => acc + x, 0) / solves.length;
      const variance =
        solves.map((x) => (x - mean) ** 2).reduce((acc, v) => acc + v, 0) /
        solves.length;
      return [Math.sqrt(variance) / mean, solves] as [number, number[]];
    });
  solution_variances.sort((a, b) => a[0] - b[0]);

  return solution_variances;
}
