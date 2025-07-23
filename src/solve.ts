/**
 * 深さ優先探索を用いて、一次不定方程式の与えられた係数と定数項に対する自然数解を探索する。
 *
 * @param coeffs 係数のリスト
 * @param target 方程式の右辺の値
 * @param index 現在の（探索中の）係数のインデックス
 * @param min_value 現在の変数 x_i が満たすべき最小値
 * @param asc 解を昇順にするかどうかのフラグ
 * @param current 現在の解のリスト（探索中の解）
 * @param solutions 見つかった解のリスト（最終的な結果を格納していく）
 */
function dfs(
  coeffs: readonly number[],
  target: number,
  index: number,
  min_value: number,
  asc: boolean,
  current: number[],
  solutions: number[][],
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

/** 一次不定方程式の自然数解を求める。
 *
 * 与えられた係数のリストと定数項(target)に対して
 * 方程式 `c_0 * x_0 + c_1 * x_1 + ... + c_n * x_n = target` の自然数解を深さ優先探索で求める。
 * ただし、`c_i` は係数、`x_i` は変数であり、すべての `x_i` は自然数（1以上）、かつ `x_i >= x_{i-1}` を満たす。
 */
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

/** 職種とその基準日額、人数の型定義 */
export type RoleCost = {
  role: string;
  cost: number;
  count: number;
};

/**
 * 職種とその基準日額、人数のリストに基づいて、目標金額に対する解を求める。
 *
 * @param input 職種とその基準日額、人数のリスト
 * @param targetAmount 目標金額（各職種の人件費の合計がこれに等しくなるような解のリストが戻り値）
 * @returns [変動係数, 解のリスト] の配列で、解のリストは各職種の稼働日数を表す。
 */
export function solve_indefinite_equation(
  input: readonly RoleCost[],
  targetAmount: number,
): [number, number[]][] {
  const costs = input.map(({ cost }) => cost);
  const solutions = solve_asc(costs, targetAmount);

  // 人数のリストを取得
  const manpower = input.map(({ count }) => count);
  const solution_variances = solutions
    .flatMap((solves) => {
      const days = solves.map((s, i) => s / (manpower[i] ?? Infinity));
      return days.every(Number.isInteger) ? [days] : [];
    })
    .map((solves) => {
      // 稼働日数の平均
      const mean = solves.reduce((acc, x) => acc + x, 0) / solves.length;
      // 稼働日数の分散
      const variance =
        solves.map((x) => (x - mean) ** 2).reduce((acc, v) => acc + v, 0) /
        solves.length;

      // 変動係数 = 標準偏差 / 平均
      return [Math.sqrt(variance) / mean, solves] as [number, number[]];
    });

  // 変動係数の昇順でソート
  solution_variances.sort((a, b) => a[0] - b[0]);

  return solution_variances;
}
