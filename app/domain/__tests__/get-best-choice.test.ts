import { expect, test } from "bun:test";
import { Temporal } from "temporal-polyfill";
import { getBestChoice } from "../get-best-choice";

test("getBestChoice", () => {
  expect(getBestChoice({
    startDate: Temporal.PlainDate.from("2025-03-08"),
    quantity: 5,
    nAtDate: 10,
    nMinusOneAtDate: 10,
    rttAtDate: 10
  })).toEqual({
    useNMinusOne: 5,
    useRtt: 0,
    useN: 0,
  })

  expect(getBestChoice({
    startDate: Temporal.PlainDate.from("2025-03-08"),
    quantity: 5,
    nAtDate: 10,
    nMinusOneAtDate: 3,
    rttAtDate: 2
  })).toEqual({
    useNMinusOne: 3,
    useRtt: 2,
    useN: 0,
  })

  expect(getBestChoice({
    startDate: Temporal.PlainDate.from("2025-03-08"),
    quantity: 5,
    nAtDate: 0,
    nMinusOneAtDate: 3,
    rttAtDate: 1
  })).toEqual({
    useNMinusOne: 3,
    useRtt: 1,
    useN: 1,
  })
  expect(getBestChoice({
    startDate: Temporal.PlainDate.from("2025-06-08"),
    quantity: 5,
    nAtDate: 10,
    nMinusOneAtDate: 10,
    rttAtDate: 10
  })).toEqual({
    useNMinusOne: 0,
    useRtt: 5,
    useN: 0,
  })

  expect(getBestChoice({
    startDate: Temporal.PlainDate.from("2025-06-08"),
    quantity: 5,
    nAtDate: 10,
    nMinusOneAtDate: 2,
    rttAtDate: 3
  })).toEqual({
    useNMinusOne: 2,
    useRtt: 3,
    useN: 0,
  })

  expect(getBestChoice({
    startDate: Temporal.PlainDate.from("2025-03-08"),
    quantity: 5,
    nAtDate: 0,
    nMinusOneAtDate: 1,
    rttAtDate: 3
  })).toEqual({
    useNMinusOne: 1,
    useRtt: 3,
    useN: 1,
  })
});
